export class userStatusStore {
    private static instance: userStatusStore;
    private userstatuses: Record<string, boolean>;

    private constructor() {
        this.userstatuses = {};
    }

    public static getInstance(): userStatusStore {
        if (!userStatusStore.instance) {
            userStatusStore.instance = new userStatusStore();
        }

        return userStatusStore.instance;
    }

    setUserOnline(userId: string): void {
        this.userstatuses[userId] = true;
    }

    setUserOffline(userId: string) {
        this.userstatuses[userId] = false;
    }

    isUserOnline(userId: string) {
        return !!this.userstatuses[userId];
    }
}
