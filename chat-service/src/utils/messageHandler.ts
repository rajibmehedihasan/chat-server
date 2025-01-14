import { rabbitMQService } from "../services/RabbitMQService";
import { UserStatusStore } from "./userStatusStore";

export const handleMessageReceived = async (
    senderName: string,
    senderEmail: string,
    receiverId: string,
    messageContent: string
) => {
    const statusStore = UserStatusStore.getInstance();
    const receiverIsOffline = !statusStore.isUserOnline(receiverId);

    if (receiverIsOffline) {
        await rabbitMQService.notifyReceiver(
            receiverId,
            messageContent,
            senderEmail,
            senderName
        );
    }
};
