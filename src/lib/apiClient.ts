/**
 * API Client - axios 연동 준비를 위한 추상화 레이어
 * 추후 axios로 교체 시 이 파일만 수정하면 됨
 */

// API 설정
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: ApiError;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

// API 에러 타입
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  status?: number;
}

// 페이지네이션 파라미터
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 필터 파라미터
export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  unitId?: string;
  [key: string]: string | undefined;
}

// 요청 옵션
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

// 에러 클래스
export class ApiException extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, string[]>;

  constructor(error: ApiError, status: number = 500) {
    super(error.message);
    this.name = 'ApiException';
    this.code = error.code;
    this.status = status;
    this.details = error.details;
  }

  static fromResponse(response: Response, body?: { message?: string; code?: string }): ApiException {
    return new ApiException(
      {
        code: body?.code || `HTTP_${response.status}`,
        message: body?.message || response.statusText || '요청 처리 중 오류가 발생했습니다.',
      },
      response.status
    );
  }

  static network(): ApiException {
    return new ApiException({
      code: 'NETWORK_ERROR',
      message: '네트워크 연결을 확인해주세요.',
    }, 0);
  }

  static timeout(): ApiException {
    return new ApiException({
      code: 'TIMEOUT',
      message: '요청 시간이 초과되었습니다.',
    }, 408);
  }

  static unauthorized(): ApiException {
    return new ApiException({
      code: 'UNAUTHORIZED',
      message: '인증이 필요합니다.',
    }, 401);
  }

  static forbidden(): ApiException {
    return new ApiException({
      code: 'FORBIDDEN',
      message: '접근 권한이 없습니다.',
    }, 403);
  }

  static notFound(resource: string = '리소스'): ApiException {
    return new ApiException({
      code: 'NOT_FOUND',
      message: `${resource}를 찾을 수 없습니다.`,
    }, 404);
  }

  static validation(details: Record<string, string[]>): ApiException {
    return new ApiException({
      code: 'VALIDATION_ERROR',
      message: '입력값을 확인해주세요.',
      details,
    }, 422);
  }
}

// 토큰 저장소
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// URL 빌더
const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean | undefined>): string => {
  const url = new URL(`${API_CONFIG.baseURL}${endpoint}`, window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

// 기본 헤더 빌더
const buildHeaders = (customHeaders?: Record<string, string>): Headers => {
  const headers = new Headers(API_CONFIG.headers);
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }
  
  return headers;
};

// 응답 파서
const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let body: { message?: string; code?: string } | undefined;
    
    if (contentType?.includes('application/json')) {
      try {
        body = await response.json();
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }
    
    // 상태 코드별 처리
    if (response.status === 401) {
      throw ApiException.unauthorized();
    }
    if (response.status === 403) {
      throw ApiException.forbidden();
    }
    if (response.status === 404) {
      throw ApiException.notFound();
    }
    
    throw ApiException.fromResponse(response, body);
  }
  
  if (contentType?.includes('application/json')) {
    const data = await response.json();
    return {
      data,
      success: true,
    };
  }
  
  return {
    data: null as T,
    success: true,
  };
};

// HTTP 메서드 구현
export const apiClient = {
  /**
   * GET 요청
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
      const response = await fetch(
        buildUrl(endpoint, options?.params),
        {
          method: 'GET',
          headers: buildHeaders(options?.headers),
          signal: options?.signal || controller.signal,
        }
      );
      
      return await parseResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw ApiException.timeout();
      }
      throw ApiException.network();
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * POST 요청
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
      const response = await fetch(
        buildUrl(endpoint, options?.params),
        {
          method: 'POST',
          headers: buildHeaders(options?.headers),
          body: data ? JSON.stringify(data) : undefined,
          signal: options?.signal || controller.signal,
        }
      );
      
      return await parseResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw ApiException.timeout();
      }
      throw ApiException.network();
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * PUT 요청
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
      const response = await fetch(
        buildUrl(endpoint, options?.params),
        {
          method: 'PUT',
          headers: buildHeaders(options?.headers),
          body: data ? JSON.stringify(data) : undefined,
          signal: options?.signal || controller.signal,
        }
      );
      
      return await parseResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw ApiException.timeout();
      }
      throw ApiException.network();
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * PATCH 요청
   */
  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
      const response = await fetch(
        buildUrl(endpoint, options?.params),
        {
          method: 'PATCH',
          headers: buildHeaders(options?.headers),
          body: data ? JSON.stringify(data) : undefined,
          signal: options?.signal || controller.signal,
        }
      );
      
      return await parseResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw ApiException.timeout();
      }
      throw ApiException.network();
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * DELETE 요청
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
      const response = await fetch(
        buildUrl(endpoint, options?.params),
        {
          method: 'DELETE',
          headers: buildHeaders(options?.headers),
          signal: options?.signal || controller.signal,
        }
      );
      
      return await parseResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw ApiException.timeout();
      }
      throw ApiException.network();
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * 파일 업로드
   */
  async upload<T>(endpoint: string, file: File | FormData, options?: RequestOptions): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout * 2); // 업로드는 타임아웃 2배
    
    try {
      const formData = file instanceof FormData ? file : new FormData();
      if (file instanceof File) {
        formData.append('file', file);
      }
      
      const headers = buildHeaders(options?.headers);
      headers.delete('Content-Type'); // FormData는 자동 설정
      
      const response = await fetch(
        buildUrl(endpoint, options?.params),
        {
          method: 'POST',
          headers,
          body: formData,
          signal: options?.signal || controller.signal,
        }
      );
      
      return await parseResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw ApiException.timeout();
      }
      throw ApiException.network();
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * 파일 다운로드
   */
  async download(endpoint: string, filename: string, options?: RequestOptions): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout * 2);
    
    try {
      const response = await fetch(
        buildUrl(endpoint, options?.params),
        {
          method: 'GET',
          headers: buildHeaders(options?.headers),
          signal: options?.signal || controller.signal,
        }
      );
      
      if (!response.ok) {
        throw ApiException.fromResponse(response);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw ApiException.timeout();
      }
      throw ApiException.network();
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

export default apiClient;
