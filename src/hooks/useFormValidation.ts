/**
 * 폼 검증 훅
 * Zod 스키마 기반 폼 상태 및 검증 관리
 */

import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';
import { formatZodErrors, emptyToUndefined } from '@/lib/validation';

/** 폼 상태 */
export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
}

/** 폼 훅 옵션 */
export interface UseFormOptions<T> {
  /** 초기값 */
  initialValues: T;
  /** 검증 스키마 */
  schema?: z.ZodSchema<T>;
  /** 실시간 검증 활성화 */
  validateOnChange?: boolean;
  /** 블러 시 검증 활성화 */
  validateOnBlur?: boolean;
  /** 제출 핸들러 */
  onSubmit?: (values: T) => Promise<void> | void;
}

/**
 * 폼 검증 및 상태 관리 훅
 */
export function useFormValidation<T extends Record<string, unknown>>({
  initialValues,
  schema,
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 변경 여부 계산
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  // 유효성 계산
  const isValid = useMemo(() => {
    if (!schema) return true;
    const result = schema.safeParse(emptyToUndefined(values));
    return result.success;
  }, [values, schema]);

  // 전체 검증
  const validate = useCallback((): boolean => {
    if (!schema) return true;

    const result = schema.safeParse(emptyToUndefined(values));

    if (result.success) {
      setErrors({});
      return true;
    }

    setErrors(formatZodErrors(result.error));
    return false;
  }, [values, schema]);

  // 단일 필드 검증
  const validateField = useCallback(
    (name: keyof T): string | undefined => {
      if (!schema) return undefined;

      // 전체 스키마로 검증 후 해당 필드 에러만 추출
      const result = schema.safeParse(emptyToUndefined(values));

      if (result.success) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name as string];
          return next;
        });
        return undefined;
      }

      const fieldError = result.error.errors.find(
        (err) => err.path[0] === name
      );

      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [name as string]: fieldError.message,
        }));
        return fieldError.message;
      }

      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as string];
        return next;
      });
      return undefined;
    },
    [values, schema]
  );

  // 값 변경 핸들러
  const handleChange = useCallback(
    (name: keyof T, value: unknown) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (validateOnChange) {
        // 다음 틱에서 검증 (값 업데이트 후)
        setTimeout(() => validateField(name), 0);
      }
    },
    [validateOnChange, validateField]
  );

  // input 이벤트 핸들러 생성
  const getInputProps = useCallback(
    (name: keyof T) => ({
      value: values[name] as string | number | undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'number' && 'valueAsNumber' in target
          ? target.valueAsNumber || 0
          : target.value;
        handleChange(name, value);
      },
      onBlur: () => {
        setTouched((prev) => ({ ...prev, [name as string]: true }));
        if (validateOnBlur) {
          validateField(name);
        }
      },
    }),
    [values, handleChange, validateOnBlur, validateField]
  );

  // checkbox 이벤트 핸들러 생성
  const getCheckboxProps = useCallback(
    (name: keyof T) => ({
      checked: Boolean(values[name]),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(name, e.target.checked);
      },
    }),
    [values, handleChange]
  );

  // select 이벤트 핸들러 생성 (Radix UI Select 용)
  const getSelectProps = useCallback(
    (name: keyof T) => ({
      value: String(values[name] || ''),
      onValueChange: (value: string) => {
        handleChange(name, value);
      },
    }),
    [values, handleChange]
  );

  // 블러 핸들러
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name as string]: true }));
      if (validateOnBlur) {
        validateField(name);
      }
    },
    [validateOnBlur, validateField]
  );

  // 제출 핸들러
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // 모든 필드를 터치됨으로 표시
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // 검증
      if (!validate()) {
        return;
      }

      if (!onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  // 초기화
  const reset = useCallback(
    (newValues?: T) => {
      setValues(newValues || initialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  // 특정 값 설정
  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 여러 값 한번에 설정
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  // 에러 직접 설정 (서버 에러 등)
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name as string]: error }));
  }, []);

  // 에러 지우기
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    // 상태
    values,
    errors,
    touched,
    isDirty,
    isValid,
    isSubmitting,

    // 핸들러
    handleChange,
    handleBlur,
    handleSubmit,

    // 헬퍼
    getInputProps,
    getCheckboxProps,
    getSelectProps,
    validate,
    validateField,
    reset,
    setValue,
    setMultipleValues,
    setFieldError,
    clearErrors,
    setValues,
  };
}

/**
 * 필드 에러 확인 헬퍼
 */
export function getFieldError(
  name: string,
  errors: Record<string, string>,
  touched: Record<string, boolean>,
  showOnlyTouched = true
): string | undefined {
  if (showOnlyTouched && !touched[name]) {
    return undefined;
  }
  return errors[name];
}
