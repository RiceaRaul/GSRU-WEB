export interface LoginRequest{
    email: string;
    password: string;
}

export interface User{
    username: string;
    token: string;
    tokenType: string;
    expiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
    avatar: string;
}