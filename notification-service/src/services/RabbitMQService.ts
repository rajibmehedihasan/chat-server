import amqp, { Channel } from "amqplib";
import config from "../config/config";
import { FCMService } from "./FCMService";
import { EmailService } from "./EmailService";
import { UserStatusStore } from "../utils";

class RabbitMQService {
    private channel!: Channel;
    private fcmService = new FCMService();
    private emailService = new EmailService();
    private userStatusStore = new UserStatusStore();

    constructor() {
        this.init();
    }

    async init() {
        const connection = await amqp.connect(config.messageBrokerURL!);
        this.channel = await connection.createChannel();
        await this.consumeNotification();
    }

    async consumeNotification() {
        await this.channel.assertQueue(config.queue.notification);
        this.channel.consume(config.queue.notification, async (msg) => {
            if (msg) {
                const {
                    type,
                    userId,
                    userEmail,
                    message,
                    userToken,
                    fromName,
                } = JSON.parse(msg.content.toString());

                if (type === "MESSAGE_RECEIVED") {
                    const isUserOnline =
                        this.userStatusStore.isUserOnline(userId);

                    if (isUserOnline && userToken) {
                        await this.fcmService.sendPushNotification(
                            userToken,
                            message
                        );
                    } else if (userEmail) {
                        await this.emailService.sendEmail(
                            userEmail,
                            `New message from ${fromName}`,
                            message
                        );
                    }
                }

                this.channel.ack(msg);
            }
        });
    }
}

export const rabbitMQService = new RabbitMQService();
