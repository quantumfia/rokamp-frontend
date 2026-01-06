/**
 * 서비스 레이어 인덱스
 * 모든 서비스 모듈을 중앙에서 export
 */

// API 클라이언트
export { apiClient, ApiException, setAccessToken, getAccessToken } from '@/lib/apiClient';
export type { ApiResponse, ApiError, PaginationParams, FilterParams, RequestOptions } from '@/lib/apiClient';

// 서비스 모듈 - 명시적 export로 충돌 방지
export * from './userService';
export * from './noticeService';
export * from './scheduleService';
export { 
  getAccidentReports, getAccidentReport, createAccidentReport, generateReport,
  getStatisticsReports, generateStatisticsReport,
  CATEGORY_LABELS, ROLE_LABELS, RANKS, ENLISTMENT_TYPES, WORK_TYPES,
  getCategoryLabel, getStatusLabel as getReportStatusLabel, getStatusColor as getReportStatusColor
} from './reportService';
export {
  getDocuments, uploadDocument, updateDocument, deleteDocument, reprocessDocument,
  getNewsArticles, uploadNewsFile, addNewsFromJson, deleteNewsArticle,
  getForecastDataList, uploadForecastData, deleteForecastData,
  getChunkSettings, saveChunkSettings,
  getStatusLabel as getDataStatusLabel, getStatusIcon, getStatusColor as getDataStatusColor
} from './dataService';
export * from './settingsService';
