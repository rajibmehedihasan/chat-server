export class UserStatusStore {
    private static instance: UserStatusStore;
    private userstatuses: Record<string, boolean>;

    private constructor() {
        this.userstatuses = {};
    }

    public static getInstance(): UserStatusStore {
        if (!UserStatusStore.instance) {
            UserStatusStore.instance = new UserStatusStore();
        }

        return UserStatusStore.instance;
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
