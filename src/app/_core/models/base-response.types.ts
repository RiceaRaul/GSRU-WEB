export interface BaseResponse<T>{
    apiError: ApiError<T>;
}

export interface ApiError<T>{
    message:string;
    data:T;
}

export interface GenericListResponse<T>{
    value: T[];
}

export interface GenericReponse<T>{
    data: T;
}

