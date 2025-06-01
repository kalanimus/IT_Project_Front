import { BASE_URL } from "./config";

interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
    setAuthToken(token: string);
  }

type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

class Api implements IApi {
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
    if (response.ok) {
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        if (contentLength === '0' || response.status === 204) {
            // @ts-ignore
            return Promise.resolve({});
        }
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            // @ts-ignore
            return response.text();
        }
    } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText))
                .catch(() => Promise.reject(response.statusText));
        } else {
            return response.text()
                .then(text => Promise.reject(text || response.statusText))
                .catch(() => Promise.reject(response.statusText));
        }
    }
}

    get<T>(uri: string) {
    // Формируем headers для каждого запроса как обычный объект
    const headers = { ...(this.options.headers as Record<string, string>) };
    return fetch(this.baseUrl + uri, {
        ...this.options,
        headers,
        method: 'GET'
    }).then(this.handleResponse<T>);
}

    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        const headers = { ...(this.options.headers as Record<string, string>) };
        return fetch(this.baseUrl + uri, {
            ...this.options,
            headers,
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

export const MyApi: IApi = new Api (BASE_URL) 

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

export interface IStudent {
    id: number;
    fullName: string;
    username: string;
    password: string;
    balance: number;
    rating: number;
    activityRate: number;
    email: string;
    verificationCode: number;
    isConfirmed: boolean;
    roleId: number;
    roleName: string;
}

export interface ITeacherTopRated {
    fullName: string;
    rating: number;
}

export interface ILatestReview {
    teacherFullName: string;
    authorFullName: string;
    rating: number;
    text: string;
    createdAt: string;
    isAnonymous: boolean;
    likedByUsernames: string[];
    dislikedByUsernames: string[];
}

// Получить самого активного студента
export async function getMostActiveStudent(): Promise<IStudent> {
    return await MyApi.get<IStudent>("/Users/most-active-student");
}

// Получить топ-3 преподавателей по рейтингу
export async function getTopRatedTeachers(): Promise<ITeacherTopRated[]> {
    return await MyApi.get<ITeacherTopRated[]>("/Teachers/top-rated");
}

// Получить последний отзыв о преподавателе
export async function getLatestTeacherReview(): Promise<ILatestReview> {
    return await MyApi.get<ILatestReview>("/Teachers/reviews/latest");
}

export async function updateUser(user: IUser): Promise<IUser> {
  return MyApi.post<IUser>(`/Users/${user.id}`, user, 'PUT');
}

export async function updateUserPartial({
  id,
  password,
  email,
  roleId,
  roleName,
}: {
  id: number;
  password?: string;
  email?: string;
  roleId: number;
  roleName: string;
}) {
  const body = {
    id: id,
    password,
    email,
    roleId: roleId,
    roleName: roleName,
  };
  if (password) body.password = password;
  if (email) body.email = email;

  const response = await MyApi.post(`/Users/${id}`, body, 'PUT');
  return response;
}

export async function fetchTeachers({ page = 1, pageSize = 10, search = '', minRating, maxRating }) {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('pageSize', String(pageSize));
  if (search) params.append('search', search);
  if (minRating !== undefined) params.append('minRating', String(minRating));
  if (maxRating !== undefined) params.append('maxRating', String(maxRating));

  return await MyApi.get(`/Teachers?${params.toString()}`);
}

export async function fetchTeacherReviews({ fullname, page = 1, pageSize = 10 }) {
  const params = new URLSearchParams();
  params.append('fullname', fullname);
  params.append('page', String(page));
  params.append('pageSize', String(pageSize));
  return await MyApi.get(`/teachers/reviews?${params.toString()}`);
}

export async function sendTeacherReview(review) {
  return await MyApi.post('/Teachers/reviews', review);
}

export async function likeReview(reviewId) {
  await MyApi.post(`/Teachers/reviews/${reviewId}/like`, {});
}

export async function dislikeReview(reviewId) {
  await MyApi.post(`/Teachers/reviews/${reviewId}/dislike`, {});
}

export async function getSurveys() {
  return await MyApi.get("/Surveys"); 
}

export async function getSurveyAnalytics({ id, group, subject }) {
  const params = new URLSearchParams({ id, group, subject });
  return await MyApi.get(`/Surveys/analytics?${params.toString()}`);
}

export async function completeSurvey(surveyId, payload) {
  return await MyApi.post(`/Surveys/${surveyId}/complete`, payload);
}

export async function fetchGroups() {
  return await MyApi.get("/Groups");
}

export async function fetchSubjects() {
  return await MyApi.get("/Subjects");
}

export async function createSurvey(payload) {
  return await MyApi.post("/Surveys", payload);
}

export async function recoverPassword(login: string) {
  return await MyApi.post("/Auth/recover-password", { username: login });
}