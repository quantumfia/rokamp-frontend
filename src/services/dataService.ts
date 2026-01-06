/**
 * 데이터 관리 서비스
 * 학습 문서, 뉴스 기사, 예보 데이터 관련 API 호출
 */

import type { ApiResponse, PaginationParams, FilterParams } from '@/lib/apiClient';
import type { LearningDocument, NewsArticle, ForecastData, ChunkSettings, PaginatedResponse, ProcessingStatus } from '@/types/entities';

// ============================================
// Mock 데이터
// ============================================

const MOCK_DOCUMENTS: LearningDocument[] = [
  { id: '1', name: '육군 안전관리 규정 v2.3', type: 'PDF', size: '2.4MB', fileName: '육군_안전관리_규정_v2.3.pdf', status: 'completed', chunks: 128, createdAt: '2024-12-10 14:30' },
  { id: '2', name: '동절기 안전수칙 매뉴얼', type: 'HWP', size: '1.8MB', fileName: '동절기_안전수칙_매뉴얼.hwp', status: 'completed', chunks: 85, createdAt: '2024-12-08 09:15' },
  { id: '3', name: '차량 운행 및 정비 매뉴얼', type: 'PDF', size: '5.2MB', fileName: '차량_운행_및_정비_매뉴얼.pdf', status: 'processing', chunks: 0, createdAt: '2024-12-14 11:00' },
  { id: '4', name: '사격훈련 안전수칙', type: 'PDF', size: '3.1MB', fileName: '사격훈련_안전수칙.pdf', status: 'completed', chunks: 156, createdAt: '2024-12-07 16:45' },
  { id: '5', name: '야간훈련 지침서', type: 'HWP', size: '1.2MB', fileName: '야간훈련_지침서.hwp', status: 'completed', chunks: 62, createdAt: '2024-12-05 10:20' },
];

const MOCK_NEWS: NewsArticle[] = [
  { id: '1', title: '군 안전사고 예방 종합대책 발표', source: '국방일보', date: '2024-12-13', status: 'completed', embeddings: 45, inputType: 'file', fileName: '군_안전사고_예방_종합대책.pdf', fileType: 'PDF', fileSize: '1.2MB', createdAt: '2024-12-13' },
  { id: '2', title: '동절기 한파 대비 안전수칙 강화', source: '연합뉴스', date: '2024-12-12', status: 'completed', embeddings: 32, inputType: 'json', createdAt: '2024-12-12' },
  { id: '3', title: '육군 훈련장 안전점검 결과 보고', source: '국방일보', date: '2024-12-11', status: 'completed', embeddings: 28, inputType: 'json', createdAt: '2024-12-11' },
  { id: '4', title: '국방부 안전관리 혁신방안 추진', source: 'YTN', date: '2024-12-10', status: 'processing', embeddings: 0, inputType: 'file', fileName: '국방부_안전관리_혁신.pdf', fileType: 'PDF', fileSize: '0.8MB', createdAt: '2024-12-10' },
];

const MOCK_FORECAST_DATA: ForecastData[] = [
  { id: '1', name: '2014-2023년 사고 데이터', period: '2014~2023', recordCount: 15420, fileName: '사고데이터_2014_2023.xlsx', fileSize: '12.8MB', status: 'completed', createdAt: '2024-11-01 09:00' },
  { id: '2', name: '2024년 상반기 사고 데이터', period: '2024.01~06', recordCount: 1856, fileName: '사고데이터_2024_상반기.xlsx', fileSize: '2.1MB', status: 'completed', createdAt: '2024-12-01 14:30' },
];

let mockDocuments = [...MOCK_DOCUMENTS];
let mockNews = [...MOCK_NEWS];
let mockForecastData = [...MOCK_FORECAST_DATA];

// ============================================
// 학습 문서 API
// ============================================

/**
 * 학습 문서 목록 조회
 */
export async function getDocuments(
  pagination?: PaginationParams,
  filters?: FilterParams
): Promise<ApiResponse<PaginatedResponse<LearningDocument>>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockDocuments];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(doc => doc.name.toLowerCase().includes(search));
  }

  if (filters?.status) {
    filtered = filtered.filter(doc => doc.status === filters.status);
  }

  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    success: true,
    data: { items, pagination: { page, pageSize, total, totalPages } },
  };
}

/**
 * 문서 업로드
 */
export async function uploadDocument(name: string, file: File): Promise<ApiResponse<LearningDocument>> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newDoc: LearningDocument = {
    id: Date.now().toString(),
    name,
    type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
    size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
    fileName: file.name,
    status: 'processing',
    chunks: 0,
    createdAt: new Date().toISOString(),
  };

  mockDocuments = [...mockDocuments, newDoc];

  // 처리 완료 시뮬레이션
  setTimeout(() => {
    mockDocuments = mockDocuments.map(d => 
      d.id === newDoc.id ? { ...d, status: 'completed' as ProcessingStatus, chunks: Math.floor(Math.random() * 100) + 50 } : d
    );
  }, 5000);

  return { success: true, data: newDoc };
}

/**
 * 문서 수정
 */
export async function updateDocument(id: string, name: string): Promise<ApiResponse<LearningDocument>> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = mockDocuments.findIndex(d => d.id === id);
  if (index === -1) throw new Error('문서를 찾을 수 없습니다.');

  const updated = { ...mockDocuments[index], name, updatedAt: new Date().toISOString() };
  mockDocuments = mockDocuments.map((d, i) => (i === index ? updated : d));

  return { success: true, data: updated };
}

/**
 * 문서 삭제
 */
export async function deleteDocument(id: string): Promise<ApiResponse<void>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  mockDocuments = mockDocuments.filter(d => d.id !== id);

  return { success: true, data: undefined };
}

/**
 * 문서 재처리
 */
export async function reprocessDocument(id: string): Promise<ApiResponse<LearningDocument>> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = mockDocuments.findIndex(d => d.id === id);
  if (index === -1) throw new Error('문서를 찾을 수 없습니다.');

  const updated = { ...mockDocuments[index], status: 'processing' as ProcessingStatus, chunks: 0 };
  mockDocuments = mockDocuments.map((d, i) => (i === index ? updated : d));

  // 처리 완료 시뮬레이션
  setTimeout(() => {
    mockDocuments = mockDocuments.map(d => 
      d.id === id ? { ...d, status: 'completed' as ProcessingStatus, chunks: Math.floor(Math.random() * 100) + 50 } : d
    );
  }, 3000);

  return { success: true, data: updated };
}

// ============================================
// 뉴스 기사 API
// ============================================

/**
 * 뉴스 기사 목록 조회
 */
export async function getNewsArticles(
  pagination?: PaginationParams,
  filters?: FilterParams
): Promise<ApiResponse<PaginatedResponse<NewsArticle>>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockNews];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      news => news.title.toLowerCase().includes(search) || news.source.toLowerCase().includes(search)
    );
  }

  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    success: true,
    data: { items, pagination: { page, pageSize, total, totalPages } },
  };
}

/**
 * 뉴스 기사 업로드 (파일)
 */
export async function uploadNewsFile(title: string, file: File): Promise<ApiResponse<NewsArticle>> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newNews: NewsArticle = {
    id: Date.now().toString(),
    title,
    source: '업로드',
    date: new Date().toISOString().split('T')[0],
    status: 'processing',
    embeddings: 0,
    inputType: 'file',
    fileName: file.name,
    fileType: file.name.split('.').pop()?.toUpperCase(),
    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
    createdAt: new Date().toISOString(),
  };

  mockNews = [...mockNews, newNews];

  return { success: true, data: newNews };
}

/**
 * 뉴스 기사 추가 (JSON)
 */
export async function addNewsFromJson(title: string, content: string): Promise<ApiResponse<NewsArticle>> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newNews: NewsArticle = {
    id: Date.now().toString(),
    title,
    source: 'JSON 입력',
    date: new Date().toISOString().split('T')[0],
    status: 'processing',
    embeddings: 0,
    inputType: 'json',
    content,
    createdAt: new Date().toISOString(),
  };

  mockNews = [...mockNews, newNews];

  return { success: true, data: newNews };
}

/**
 * 뉴스 기사 삭제
 */
export async function deleteNewsArticle(id: string): Promise<ApiResponse<void>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  mockNews = mockNews.filter(n => n.id !== id);

  return { success: true, data: undefined };
}

// ============================================
// 예보 데이터 API
// ============================================

/**
 * 예보 데이터 목록 조회
 */
export async function getForecastDataList(
  pagination?: PaginationParams,
  filters?: FilterParams
): Promise<ApiResponse<PaginatedResponse<ForecastData>>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockForecastData];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(data => data.name.toLowerCase().includes(search));
  }

  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    success: true,
    data: { items, pagination: { page, pageSize, total, totalPages } },
  };
}

/**
 * 예보 데이터 업로드
 */
export async function uploadForecastData(name: string, period: string, file: File): Promise<ApiResponse<ForecastData>> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const newData: ForecastData = {
    id: Date.now().toString(),
    name,
    period,
    recordCount: 0,
    fileName: file.name,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
    status: 'processing',
    createdAt: new Date().toISOString(),
  };

  mockForecastData = [...mockForecastData, newData];

  // 처리 완료 시뮬레이션
  setTimeout(() => {
    mockForecastData = mockForecastData.map(d => 
      d.id === newData.id ? { ...d, status: 'completed' as ProcessingStatus, recordCount: Math.floor(Math.random() * 5000) + 1000 } : d
    );
  }, 5000);

  return { success: true, data: newData };
}

/**
 * 예보 데이터 삭제
 */
export async function deleteForecastData(id: string): Promise<ApiResponse<void>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  mockForecastData = mockForecastData.filter(d => d.id !== id);

  return { success: true, data: undefined };
}

// ============================================
// 청크 설정 API
// ============================================

let currentChunkSettings: ChunkSettings = {
  chunkSize: 1024,
  overlapPercent: 20,
  embeddingModel: 'text-embedding-3-small',
};

/**
 * 청크 설정 조회
 */
export async function getChunkSettings(): Promise<ApiResponse<ChunkSettings>> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data: { ...currentChunkSettings } };
}

/**
 * 청크 설정 저장
 */
export async function saveChunkSettings(settings: ChunkSettings): Promise<ApiResponse<ChunkSettings>> {
  await new Promise(resolve => setTimeout(resolve, 300));
  currentChunkSettings = { ...settings };
  return { success: true, data: currentChunkSettings };
}

// ============================================
// 헬퍼 함수
// ============================================

export const getStatusLabel = (status: ProcessingStatus): string => {
  const labels: Record<ProcessingStatus, string> = {
    completed: '완료',
    processing: '처리중',
    failed: '실패',
  };
  return labels[status];
};

export const getStatusIcon = (status: ProcessingStatus): string => {
  const icons: Record<ProcessingStatus, string> = {
    completed: 'CheckCircle',
    processing: 'Clock',
    failed: 'AlertCircle',
  };
  return icons[status];
};

export const getStatusColor = (status: ProcessingStatus): string => {
  const colors: Record<ProcessingStatus, string> = {
    completed: 'text-green-600',
    processing: 'text-yellow-600',
    failed: 'text-red-600',
  };
  return colors[status];
};
