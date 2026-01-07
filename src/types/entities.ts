/**
 * 엔티티 타입 정의
 * 모든 데이터 모델 타입을 중앙화하여 관리
 */

// ============================================
// 공통 타입
// ============================================

/** 상태 타입 */
export type Status = 'active' | 'inactive' | 'pending' | 'expired';

/** 처리 상태 타입 */
export type ProcessingStatus = 'completed' | 'processing' | 'failed';

/** 심각도 타입 */
export type Severity = 'low' | 'medium' | 'high';

/** 위험 수준 타입 */
export type RiskLevel = 'low' | 'medium' | 'high';

/** 페이지네이션 정보 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** 페이지네이션된 응답 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

/** 기본 엔티티 (모든 엔티티의 베이스) */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// 사용자 관련 타입
// ============================================

/** 사용자 역할 */
export type UserRole = 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_HQ' | 'ROLE_DIV' | 'ROLE_BN';

/** 사용자 */
export interface User extends BaseEntity {
  accountId: string;      // 로그인용 계정 ID
  militaryId: string;     // 군번 (고유 식별)
  name: string;
  rank: string;
  unitId: string;
  role: UserRole;
  status: Status;
  email?: string;
  phone?: string;
  lastLoginAt?: string;
}

/** 사용자 생성 DTO */
export interface CreateUserDto {
  accountId: string;
  militaryId: string;
  name: string;
  rank: string;
  unitId: string;
  password: string;
  role?: UserRole;
}

/** 사용자 수정 DTO */
export interface UpdateUserDto {
  name?: string;
  rank?: string;
  unitId?: string;
  role?: UserRole;
  status?: Status;
}

// ============================================
// 공지사항 관련 타입
// ============================================

/** 비디오 링크 */
export interface VideoLink {
  id: string;
  url: string;
}

/** 첨부 링크 */
export interface AttachmentLink {
  id: string;
  name: string;
  url: string;
}

/** 공지사항 */
export interface Notice extends BaseEntity {
  title: string;
  content: string;
  target: string;           // 'all' | 특정 부대 ID
  targetLabel: string;      // 표시용 대상 라벨
  videoUrls?: VideoLink[];
  hasVideo: boolean;
  hasAttachment: boolean;
  attachments?: AttachmentLink[];
  author: string;
  authorId: string;
  status: 'active' | 'expired';
  publishedAt?: string;
  expiresAt?: string;
}

/** 공지사항 생성 DTO */
export interface CreateNoticeDto {
  title: string;
  content: string;
  target: string;
  videoUrls?: VideoLink[];
  attachments?: Omit<AttachmentLink, 'id'>[];
}

/** 공지사항 수정 DTO */
export interface UpdateNoticeDto extends Partial<CreateNoticeDto> {
  status?: 'active' | 'expired';
}

// ============================================
// 사고 관련 타입
// ============================================

/** 사고 사례 */
export interface Incident extends BaseEntity {
  title: string;
  description: string;
  incidentDate: string;
  location: string;
  category: string;
  severity: Severity;
  author: string;
  authorId: string;
  unitId?: string;
}

/** 사고 생성 DTO */
export interface CreateIncidentDto {
  title: string;
  description: string;
  incidentDate: string;
  location: string;
  category: string;
  severity: Severity;
}

/** 사고 수정 DTO */
export interface UpdateIncidentDto extends Partial<CreateIncidentDto> {}

// ============================================
// 훈련 일정 관련 타입
// ============================================

/** 훈련 유형 */
export type TrainingType = '사격' | '기동' | '전술' | '체력' | '교육' | '점검';

/** 훈련 일정 */
export interface TrainingSchedule extends BaseEntity {
  title: string;
  unit: string;
  unitId: string;
  date: string;           // ISO date string
  startTime: string;      // HH:mm
  endTime: string;        // HH:mm
  location: string;
  type: TrainingType;
  riskLevel: RiskLevel;
  participants: number;
  description?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

/** 훈련 일정 생성 DTO */
export interface CreateTrainingScheduleDto {
  title: string;
  unitId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: TrainingType;
  riskLevel?: RiskLevel;
  participants?: number;
  description?: string;
}

/** 훈련 일정 수정 DTO */
export interface UpdateTrainingScheduleDto extends Partial<CreateTrainingScheduleDto> {
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// ============================================
// 보고서 관련 타입
// ============================================

/** 관련자 정보 */
export interface PersonInvolved {
  id: string;
  role: 'suspect' | 'victim' | 'injured' | 'witness';
  isMilitary: boolean;
  name: string;
  rank?: string;
  unit?: string;
  enlistmentType?: string;
  gender?: string;
  age?: number;
}

/** 사고 보고서 */
export interface AccidentReport extends BaseEntity {
  date: string;
  time: string;
  location: string;
  locationDetail: 'inside' | 'outside';
  specificPlace: string;
  categoryMajor: string;
  categoryMiddle?: string;
  categoryMinor?: string;
  cause?: string;
  overview: string;
  personsInvolved: PersonInvolved[];
  militaryDeaths: number;
  civilianDeaths: number;
  militaryInjuries: number;
  civilianInjuries: number;
  militaryDamage?: string;
  civilianDamage?: string;
  alcoholInvolved: boolean;
  crimeTool?: string;
  workType?: string;
  actionsTaken?: string;
  reporter: string;
  reporterRank: string;
  reporterContact?: string;
  generatedContent?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

/** 통계 보고서 */
export interface StatisticsReport extends BaseEntity {
  title: string;
  period: string;
  unitId: string;
  unitName: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'draft' | 'final';
  author: string;
  summary?: string;
  fileUrl?: string;
}

// ============================================
// 데이터 관리 관련 타입
// ============================================

/** 학습 문서 */
export interface LearningDocument extends BaseEntity {
  name: string;
  type: string;         // PDF, HWP, DOCX
  size: string;
  fileName: string;
  status: ProcessingStatus;
  chunks: number;
  uploadedBy?: string;
}

/** 뉴스 기사 */
export interface NewsArticle extends BaseEntity {
  title: string;
  source: string;
  date: string;
  status: ProcessingStatus;
  embeddings: number;
  inputType: 'file' | 'json';
  content?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
}

/** 예보 데이터 */
export interface ForecastData extends BaseEntity {
  name: string;
  period: string;
  recordCount: number;
  fileName: string;
  fileSize: string;
  status: ProcessingStatus;
  uploadedBy?: string;
}

/** 청크 설정 */
export interface ChunkSettings {
  chunkSize: number;
  overlapPercent: number;
  embeddingModel: string;
}

// ============================================
// 시스템 설정 관련 타입
// ============================================

/** 허용 IP */
export interface AllowedIP extends BaseEntity {
  ip: string;
  unit: string;
  description?: string;
}

/** 감사 로그 */
export interface AuditLog extends BaseEntity {
  accountId: string;
  militaryId: string;
  userName: string;
  rank: string;
  ip: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'success' | 'failed';
  details?: string;
}

// ============================================
// 챗봇 관련 타입
// ============================================

/** 채팅 메시지 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  references?: DocumentReference[];
  timestamp: string;
}

/** 문서 참조 */
export interface DocumentReference {
  title: string;
  source: string;
  url?: string;
  page?: number;
  score?: number;
}

/** AI 모델 정보 */
export interface AIModel {
  id: string;
  label: string;
  description?: string;
  isDefault?: boolean;
}

/** 문서 소스 */
export interface DocumentSource {
  id: string;
  label: string;
  description: string;
}

// ============================================
// 부대 관련 타입
// ============================================

/** 부대 */
export interface Unit {
  id: string;
  name: string;
  type: 'hq' | 'corps' | 'division' | 'brigade' | 'battalion';
  parentId?: string;
  children?: Unit[];
  fullPath?: string;
}

// ============================================
// 예보 분석 관련 타입
// ============================================

/** 주간 예보 */
export interface WeeklyForecast {
  weekNumber: number;
  startDate: string;
  endDate: string;
  overallRisk: RiskLevel;
  riskScore: number;
  factors: RiskFactor[];
  recommendations: string[];
}

/** 위험 요소 */
export interface RiskFactor {
  name: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

/** 트렌드 데이터 */
export interface TrendData {
  date: string;
  value: number;
  category?: string;
}

// ============================================
// 대시보드 관련 타입
// ============================================

/** 대시보드 통계 */
export interface DashboardStats {
  totalIncidents: number;
  highRiskUnits: number;
  activeTrainings: number;
  pendingReports: number;
  riskLevel: RiskLevel;
  riskScore: number;
}

/** 부대별 위험도 */
export interface UnitRisk {
  unitId: string;
  unitName: string;
  riskLevel: RiskLevel;
  riskScore: number;
  incidentCount: number;
  trend: 'up' | 'down' | 'stable';
}
