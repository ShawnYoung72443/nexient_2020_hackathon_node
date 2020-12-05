export type { PushSubscription } from 'web-push';

export interface SubscriptionService {
    addPushSubscriber(userId: string, subscription: PushSubscription): void;
    addPollSubscriber(userId: string): void;
    unsubscribe(userId: string): void;
}

export interface NotificationService {
    sendToUser(userId: string, notification: object): Promise<any>;
    sendToAll(notification: object): Promise<any>;
}

