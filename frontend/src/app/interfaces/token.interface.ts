//expotamos las interfaces para usarlas en otros archivos

export interface TokenData {
    token: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T; 
}