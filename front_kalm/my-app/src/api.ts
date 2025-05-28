import { BASE_URL } from "./config";

interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
    setAuthToken(token: string);
  }

type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

class Api implements IApi{
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get<T>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }

    setAuthToken(token: string) {
        this.options.headers = {
            ...this.options.headers,
            Authorization: `Bearer ${token}`,
        };
    }
}

const MyApi: IApi = new Api (BASE_URL) 

export interface IUser {
    id: number;
    fullName: string;
    username: string;
    balance: number;
    rating: number;
    activityRate: number;
    email: string | null;
    roleId: number;
    roleName: string;
}

export async function register(username: string, password: string): Promise <{token: string, expiration: string, message: string, requireVerification: boolean}>{
    const response = await MyApi.post<{token: string, expiration: string, message: string, requireVerification: boolean}>(
        "/Auth/register", {username, password}, 'POST'
    );
    if (response.token) {
        MyApi.setAuthToken(response.token);
    }
    return response;
}

export async function verify(username: string, password: string, code: number): Promise<{token: string, expiration: string, message: string}> {
    const response = await MyApi.post<{token: string, expiration: string, message: string}>(
        "/Auth/verify",
        { username, password, code },
        'POST'
    );
    if (response.token) {
        MyApi.setAuthToken(response.token);
    }
    return response;
}

export async function login(username: string, password: string): Promise<{token: string, expiration: string, message: string, requireVerification: boolean}> {
    const response = await MyApi.post<{token: string, expiration: string, message: string, requireVerification: boolean}>(
        "/Auth/login",
        { username, password },
        'POST'
    );
    if (response.token) {
        MyApi.setAuthToken(response.token);
    }
    return response;
}

export async function getMe(): Promise<IUser> {
    const response = await MyApi.get<any>("/Auth/me");
    // Оставляем только нужные поля
    return {
        id: response.id,
        fullName: response.fullName,
        username: response.username,
        balance: response.balance,
        rating: response.rating,
        activityRate: response.activityRate,
        email: response.email,
        roleId: response.roleId,
        roleName: response.roleName,
    };
}