import type { Notification } from './notification';
import type { PushSubscription } from 'web-push';

export interface PushSubscriberStore {
    add(userId: string, subscription: PushSubscription): void;
    getByUser(userId: string): Promise<PushSubscription | null>;
    remove(userId: string): void;
}

export interface PollSubscriberStore {
    add(userId: string): void;
    addNotification(userId: string, notification: Notification): Promise<any>;
    getNotifications(userId: string): Promise<Notification[]>;
    remove(userId: string): void;
}

export class MemoryPushSubscriberStore implements PushSubscriberStore {
    private userSubscriptions: Map<string, PushSubscription> = new Map();

    add(userId: string, subscription: PushSubscription): void {
        this.userSubscriptions.set(userId, subscription);
    }

    async getByUser(userId: string): Promise<PushSubscription | null> {
        if (this.userSubscriptions.has(userId)) {
            return this.userSubscriptions.get(userId);
        }
        return null;
    }

    remove(userId: string): void {
        this.userSubscriptions.delete(userId);
    }
}

interface QueuedNotification {
    notification: Notification;
    onDelivery(): void;
    onDeleteUnseen(): void;
}

export class MemoryPollSubscriberStore implements PollSubscriberStore {
    private userQueues: Map<string, QueuedNotification[]> = new Map();

    add(userId: string): void {
        this.userQueues.set(userId, []);
    }

    addNotification(userId: string, notification: Notification): Promise<any> {
        if (!this.userQueues.has(userId)) {
            return Promise.reject('No such user');
        }
        const queuedNotification = {
            notification,
            onDelivery() {},
            onDeleteUnseen() {}
        }

        this.userQueues.get(userId).push(queuedNotification);

        return new Promise((resolve, reject) => {
            queuedNotification.onDelivery = () => resolve('success');
            queuedNotification.onDeleteUnseen = () => reject('user unsubscribed');
        });

    }

    getNotifications(userId: string): Promise<Notification[]> {
        if (!this.userQueues.has(userId)) {
            return Promise.reject('No such user');
        }
        const queuedNotifications = this.userQueues.get(userId).slice();
        for (const notification of queuedNotifications) {
            notification.onDelivery();
        }
        const notifications = queuedNotifications.map(queued => queued.notification);
        this.userQueues.set(userId, []);
        return Promise.resolve(notifications);
    }

    remove(userId: string): void {
        if (!this.userQueues.has(userId)) {
            return;
        }
        for (const notification of this.userQueues.get(userId)) {
            notification.onDeleteUnseen();
        }
        this.userQueues.delete(userId);
    }
}
