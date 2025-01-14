import { rabbitMQService } from "../services/RabbitMQService";
import { userStatusStore } from "./userStatusStore";

export const handleMessageReceived = async (
    senderName: string,
    senderEmail: string,
    receiverId: string,
    messageContent: string
) => {
    const statusStore = userStatusStore.getInstance();
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
