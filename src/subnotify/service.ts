import type { Notification } from './notification';
import type { NotificationResponse } from 'web-push';
import type { PushSubscriberStore, PollSubscriberStore } from './store';


export interface SubscriptionService {
    addPushSubscriber(userId: string, subscription: PushSubscription): void;
    addPollSubscriber(userId: string): void;
    unsubscribePush(userId: string): void;
    unsubscribePoll(userId: string): void;
}

export interface NotificationService {
    sendNotification(userId: string, notification: Notification): Promise<any>;
    poll(userId: string): Promise<Notification[]>;
}


interface PushNotificationSender {
    sendNotification(
        pushSubscription: PushSubscription,
        payload: string | Buffer
    ): Promise<NotificationResponse>;
}

export class NotificationSubscriptionService implements SubscriptionService, NotificationService {
    private pushSubscribers: PushSubscriberStore;
    private pollSubscribers: PollSubscriberStore;
    private push: PushNotificationSender;

    constructor(
        pushSubscribers: PushSubscriberStore,
        pollSubscribers: PollSubscriberStore,
        push: PushNotificationSender
    ) {
        this.pushSubscribers = pushSubscribers;
        this.pollSubscribers = pollSubscribers;
        this.push = push;
    }

    addPushSubscriber(userId: string, subscription: PushSubscription): void {
        this.pushSubscribers.add(userId, subscription);
    }

    addPollSubscriber(userId: string): void {
        this.pollSubscribers.add(userId);
    }

    unsubscribePush(userId: string): void {
        this.pushSubscribers.remove(userId);
    }

    unsubscribePoll(userId: string): void {
        this.pollSubscribers.remove(userId);
    }

    async sendNotification(userId: string, notification: Notification): Promise<any> {
        const pushSubscription = await this.pushSubscribers.getByUser(userId);
        if (pushSubscription) {
            const payload: string = JSON.stringify(notification);
            return this.push.sendNotification(pushSubscription, payload);
        }
        return this.pollSubscribers.addNotification(userId, notification);

    }

    poll(userId: string): Promise<Notification[]> {
        return this.pollSubscribers.getNotifications(userId);
    }
}
