export interface LoginResponse {
    access_token: string;
    message: string;
    user: {
        email: string;
        id: number;
        nombre: string;
        rol: string;
    };
}