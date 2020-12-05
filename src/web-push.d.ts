declare module 'web-push' {
    export interface PushSubscription {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }

    export type SupportedContentEncoding = 'aesgcm' | 'aes128gcm';

    export interface WebPushOptions {
        gcmAPIKey?: string;
        vapidDetails?: {
            subject: string;
            publicKey: string;
            privateKey: string;
        };
        timeout?: number;
        TTL?: number;
        headers?: object;
        contentEncoding?: SupportedContentEncoding;
        proxy?: string | object;
        agent?: HTTPSAgent;
    }

    export interface NotificationResponse {
        statusCode: number;
        headers: object;
        body: string;
    }

    export function sendNotification(
        pushSubscription: PushSubscription,
        payload?: string | Buffer,
        options?: WebPushOptions
    ): Promise<NotificationResponse>;

    export interface VAPIDKeys {
        publicKey: string;
        privateKey: string;
    }

    export function generateVAPIDKeys(): VAPIDKeys;

    export function setGCMAPIKey(apiKey: string): void;

    export interface EncryptResult {
        localPublicKey: string | Buffer;
        salt: string;
        cipherText: Buffer;
    }

    export function encrypt(
        userPublicKey: string,
        userAuth: string,
        payload: string | Buffer,
        contentEncoding: SupportedContentEncoding
    ): EncryptResult;

    export interface VapidHeaders {
        Authorization: string;
        'Crypto-Key'?: string;
    }

    export function getVapidHeaders(
        audience: string,
        subject: string,
        publicKey: string,
        privateKey: string,
        contentEncoding: SupportedContentEncoding,
        expiration?: number
    ): VapidHeaders;

    export interface RequestDetails {
        endpoint: string;
        method: 'POST';
        headers: object;
        body: Buffer;
    }

    export function generateRequestDetails(
        pushSubscription: PushSubscription,
        payload?: string | Buffer,
        options?: WebPushOptions
    ): RequestDetails;

    export function setVapidDetails(
        subject: string,
        publicKey: string,
        privateKey: string
    ): void;

    export class WebPushError extends Error implements NotificationResponse {
        constructor(
            message: string,
            statusCode: number,
            headers: object,
            body: Buffer,
            endpoint: string
        );
        name: string;
        message: string;
        statusCode: string;
        headers: object;
        body: string;
        endpoint: string;
    }
}
