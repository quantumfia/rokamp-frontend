/**
 * 비동기 작업 관리 훅
 * API 호출, 로딩 상태, 에러 처리를 통합 관리
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiException } from '@/lib/apiClient';
import { toast } from '@/hooks/use-toast';

/** 비동기 상태 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiException | null;
  isSuccess: boolean;
}

/** 비동기 액션 옵션 */
export interface AsyncOptions<T> {
  /** 초기 데이터 */
  initialData?: T | null;
  /** 성공 시 토스트 메시지 */
  successMessage?: string;
  /** 에러 시 토스트 표시 여부 */
  showErrorToast?: boolean;
  /** 에러 메시지 커스텀 */
  errorMessage?: string | ((error: ApiException) => string);
  /** 성공 콜백 */
  onSuccess?: (data: T) => void;
  /** 에러 콜백 */
  onError?: (error: ApiException) => void;
  /** 완료 콜백 (성공/실패 무관) */
  onSettled?: () => void;
}

/**
 * 비동기 함수 실행 훅
 */
export function useAsync<T, TArgs extends unknown[] = []>(
  asyncFn: (...args: TArgs) => Promise<T>,
  options: AsyncOptions<T> = {}
) {
  const {
    initialData = null,
    successMessage,
    showErrorToast = true,
    errorMessage,
    onSuccess,
    onError,
    onSettled,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...args: TArgs): Promise<T | null> => {
      // 이전 요청 취소
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState(prev => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      try {
        const result = await asyncFn(...args);

        if (!mountedRef.current) return null;

        setState({
          data: result,
          isLoading: false,
          isError: false,
          error: null,
          isSuccess: true,
        });

        if (successMessage) {
          toast({
            title: '완료',
            description: successMessage,
          });
        }

        onSuccess?.(result);
        onSettled?.();

        return result;
      } catch (error) {
        if (!mountedRef.current) return null;

        const apiError = error instanceof ApiException 
          ? error 
          : new ApiException({
              code: 'UNKNOWN_ERROR',
              message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
            });

        setState(prev => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: apiError,
          isSuccess: false,
        }));

        if (showErrorToast) {
          const message = typeof errorMessage === 'function'
            ? errorMessage(apiError)
            : errorMessage || apiError.message;

          toast({
            title: '오류',
            description: message,
            variant: 'destructive',
          });
        }

        onError?.(apiError);
        onSettled?.();

        return null;
      }
    },
    [asyncFn, successMessage, showErrorToast, errorMessage, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
  }, [initialData]);

  const setData = useCallback((data: T | ((prev: T | null) => T)) => {
    setState(prev => ({
      ...prev,
      data: typeof data === 'function' ? (data as (prev: T | null) => T)(prev.data) : data,
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

/**
 * 즉시 실행 비동기 훅 (컴포넌트 마운트 시 자동 실행)
 */
export function useAsyncEffect<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = [],
  options: AsyncOptions<T> = {}
) {
  const { execute, ...state } = useAsync(asyncFn, options);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...state,
    refetch: execute,
  };
}

/**
 * 뮤테이션 훅 (데이터 변경 작업용)
 */
export function useMutation<T, TArgs extends unknown[] = []>(
  mutationFn: (...args: TArgs) => Promise<T>,
  options: AsyncOptions<T> & {
    /** 성공 시 캐시 무효화 키 */
    invalidateKeys?: string[];
  } = {}
) {
  return useAsync(mutationFn, {
    ...options,
    showErrorToast: options.showErrorToast ?? true,
  });
}

/**
 * 낙관적 업데이트 훅
 */
export function useOptimisticUpdate<T, TArgs extends unknown[]>(
  currentData: T | null,
  mutationFn: (...args: TArgs) => Promise<T>,
  optimisticUpdate: (current: T | null, ...args: TArgs) => T,
  options: AsyncOptions<T> = {}
) {
  const [optimisticData, setOptimisticData] = useState<T | null>(currentData);
  const previousDataRef = useRef<T | null>(null);

  const mutation = useAsync(mutationFn, {
    ...options,
    onSuccess: (data) => {
      setOptimisticData(data);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      // 롤백
      setOptimisticData(previousDataRef.current);
      options.onError?.(error);
    },
  });

  const execute = useCallback(
    async (...args: TArgs) => {
      previousDataRef.current = optimisticData;
      setOptimisticData(optimisticUpdate(optimisticData, ...args));
      return mutation.execute(...args);
    },
    [optimisticData, optimisticUpdate, mutation]
  );

  // currentData가 변경되면 동기화
  useEffect(() => {
    if (currentData !== null && !mutation.isLoading) {
      setOptimisticData(currentData);
    }
  }, [currentData, mutation.isLoading]);

  return {
    ...mutation,
    data: optimisticData,
    execute,
  };
}
