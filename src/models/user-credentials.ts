export interface UserCredentials {
    username: string;
    password: string;
}

export namespace UserCredentials {
    export type Details = UserCredentials;
    export type Field = keyof UserCredentials;
}
