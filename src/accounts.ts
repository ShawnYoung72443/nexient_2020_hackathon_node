export type UserId = string;


export interface CreateUserParameters {
    email: string;
    firstName: string;
    lastName: string;
}

export interface User extends CreateUserParameters {
    userId: string;
    locked: boolean;
}

export interface UserRepo {

    // Use when signing in.
    // Make sure it and CredentialRepo.createCredential() are done together.
    createUser(params: CreateUserParameters): Promise<User | null>;

    // Other types will only reference User via userId.
    // Use this to retrieve the whole object and verify the id.
    getUserById(userId: string): Promise<User | null>;

    // Look up user by email.
    // Use for signing in and making sure emails are unique.
    getUserByEmail(email: String): Promise<User | null>;

    // Useful for autocomplete / search.
    getUsersByFirstNamePrefix(firstNamePrefix: string): Promise<User[]>;
    getUsersByLastNamePrefix(lastNamePrefix: string): Promise<User[]>;

    // Update a user's email or name.
    updateUser(user: User): Promise<any>;

    // Delete a user - make sure to also delete the user's credentials
    // preferences, blocklist, friends list, pending requests, etc.
    deleteUser(user: string | User): Promise<any>;
}

export interface CreateCredentialParameters {
    userId: string;
    passwordHash: string;
    salt: string;
}

export interface Credential extends CreateCredentialParameters {
    passwordExpirationDate: Date;
}

export interface CredentialRepo {
    createCredential(params: CreateCredentialParameters): Promise<Credential>;
    getCredentialByUserId(userId: string): Promise<Credential | null>;
    updateCredential(cred: Credential): Promise<any>;
    deleteCredential(userId: string): Promise<any>;
}

export interface CreateSessionParameters {
    userId: string;
    expires: Date;
}

export interface Session {
    sessionId: string;
    userId: string;
    created: Date;
    expires: Date;
    active: boolean;
}

export interface SessionRepo {
    createSession(params: CreateSessionParameters): Promise<Session>;
    getSessionBySessionId(sessionId: string): Promise<Session | null>;
    getCurrentSessionForUserId(userId: string): Promise<Session | null>;
    updateSession(session: Session): Promise<any>;
    deleteSession(session: string | Session): Promise<any>;
}
