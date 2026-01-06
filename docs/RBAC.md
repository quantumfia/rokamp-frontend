# ROKA 안전사고 예방 시스템 - 역할별 접근 권한 (RBAC)

## 역할 정의

| 역할 코드 | 역할명 | 설명 | 예시 |
|-----------|--------|------|------|
| `ROLE_HQ` | 슈퍼 관리자 | 육군본부 군사경찰실 | 전군 데이터 접근 |
| `ROLE_DIV` | 관리자 | 사단장/여단장급 | 예하 부대 데이터 접근 |
| `ROLE_BN` | 사용자 | 대대장급 | 본인 부대 데이터 접근 |

---

## 메인 메뉴

### 1. 대시보드 (`/dashboard`)

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 페이지 접근 | ✅ | ✅ | ✅ |
| 전군 현황 보기 | ✅ | ❌ | ❌ |
| 예하 부대 현황 보기 | ✅ | ✅ | ❌ |
| 본인 부대 현황 보기 | ✅ | ✅ | ✅ |
| 부대 필터링 | 전군 | 예하 부대 | 본인 부대 |
| 위험도 게이지 | 전군 평균 | 예하 부대 평균 | 본인 부대 |
| 지도 표시 범위 | 전군 | 예하 부대 | 본인 부대 |
| 부대 상세 패널 접근 | 전군 | 예하 부대 | 본인 부대 |

---

### 2. 예보 분석 (`/forecast`)

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 페이지 접근 | ✅ | ✅ | ✅ |
| 주간 예보 조회 | 전군 | 예하 부대 | 본인 부대 |
| 추세 분석 조회 | 전군 | 예하 부대 | 본인 부대 |
| 부대 선택 범위 | 전군 | 예하 부대 | 본인 부대 |

---

### 3. AI 챗봇 (`/chatbot`)

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 페이지 접근 | ✅ | ✅ | ✅ |
| AI 모델 선택 | ✅ | ✅ | ✅ |
| 검색 범위 설정 | ✅ | ✅ | ✅ |
| 질의응답 | ✅ | ✅ | ✅ |
| 문서 참조 | ✅ | ✅ | ✅ |
| 추천 질문 | ✅ | ✅ | ✅ |

> **참고**: 챗봇은 안전 정보 제공 목적으로 모든 역할에게 동일한 기능 제공

---

### 4. 보고서 (`/reports`)

#### 4.1 사고 보고서 탭

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 탭 접근 | ✅ | ✅ | ✅ |
| 조회 범위 | 전군 | 예하 부대 | 본인 부대 |
| 보고서 작성 | ✅ 전군 | ✅ 예하 부대 | ✅ 본인 부대 |
| 보고서 수정 | ✅ 전군 | 본인 작성분 | 본인 작성분 |
| 보고서 삭제 | ✅ 전군 | 본인 작성분 | 본인 작성분 |

#### 4.2 통계 보고서 탭

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 탭 접근 | ✅ | ✅ | ✅ |
| 조회 범위 | 전군 | 예하 부대 | 본인 부대 |
| 보고서 생성 | ✅ 전군 | ✅ 예하 부대 | ✅ 본인 부대 |
| PDF 다운로드 | ✅ | ✅ | ✅ |

---

## 관리 메뉴

### 5. 공지 관리 (`/admin/notice`)

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 페이지 접근 | ✅ | ✅ | ❌ |
| 공지 조회 | 전군 | 예하 부대 | - |
| 공지 등록 | ✅ 전군 대상 | ✅ 예하 부대 대상 | - |
| 공지 수정 | ✅ 전군 | 본인 작성분 | - |
| 공지 삭제 | ✅ 전군 | 본인 작성분 | - |
| 사례 조회 | 전군 | 예하 부대 | - |
| 사례 등록 | ✅ | ✅ 예하 부대 | - |
| 사례 수정/삭제 | ✅ 전군 | 본인 작성분 | - |

---

### 6. 일정 관리 (`/admin/schedule`)

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 페이지 접근 | ✅ | ✅ | ✅ |
| 일정 조회 | 전군 | 예하 부대 | 본인 부대 |
| 일정 등록 | ✅ 전군 | ✅ 예하 부대 | ✅ 본인 부대 |
| 일정 수정 | ✅ 전군 | ✅ 예하 부대 | ✅ 본인 부대 |
| 일정 삭제 | ✅ 전군 | ✅ 예하 부대 | ✅ 본인 부대 |
| 일괄 업로드 | ✅ | ✅ 예하 부대 | ✅ 본인 부대 |

---

### 7. 데이터 관리 (`/data`)

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 페이지 접근 | ✅ | ❌ | ❌ |
| 학습 문서 업로드 | ✅ | - | - |
| 뉴스 기사 업로드 | ✅ | - | - |
| 예보 데이터 업로드 | ✅ | - | - |
| 청크 설정 | ✅ | - | - |

---

### 8. 사용자 관리 (`/admin/users`)

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 페이지 접근 | ✅ | ✅ | ❌ |
| 사용자 조회 | 전군 | 예하 부대 | - |
| 사용자 등록 | ✅ 전군 | ✅ 예하 부대 | - |
| 사용자 수정 | ✅ 전군 | ✅ 예하 부대 | - |
| 사용자 삭제 | ✅ 전군 | ✅ 예하 부대 | - |
| 역할 변경 | ✅ | ❌ | - |

---

### 9. 보안/감사 (`/admin/settings`)

| 기능 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 페이지 접근 | ✅ | ❌ | ❌ |
| 보안 정책 설정 | ✅ | - | - |
| IP 접근 제어 | ✅ | - | - |
| 감사 로그 조회 | ✅ | - | - |

---

## LNB 메뉴 표시 정책

### 메인 메뉴

| 메뉴 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 대시보드 | ✅ | ✅ | ✅ |
| 예보 분석 | ✅ | ✅ | ✅ |
| 챗봇 | ✅ | ✅ | ✅ |
| 보고서 | ✅ | ✅ | ✅ |

### 관리 메뉴

| 메뉴 | ROLE_HQ | ROLE_DIV | ROLE_BN |
|------|:-------:|:--------:|:-------:|
| 공지 관리 | ✅ | ✅ | ❌ |
| 일정 관리 | ✅ | ✅ | ✅ |
| 데이터 관리 | ✅ | ❌ | ❌ |
| 사용자 관리 | ✅ | ✅ | ❌ |
| 보안/감사 | ✅ | ❌ | ❌ |

---

## 구현 상세

### 부대 데이터 필터링

역할과 소속 부대에 따라 접근 가능한 부대 범위가 자동으로 필터링됩니다.

```typescript
// src/lib/rbac.ts

// 하위 부대 ID 조회
function getSubordinateUnitIds(unitId: string): string[]

// 상위 부대 체인 조회
function getParentUnitChain(unitId: string): string[]

// 역할별 접근 가능 부대 ID 목록
function getAccessibleUnitIds(role: UserRole, userUnitId: string): string[]
// - ROLE_HQ: 전체 부대
// - ROLE_DIV: 소속 부대 + 예하 부대
// - ROLE_BN: 소속 부대만

// 역할별 접근 가능 부대 객체 목록
function getAccessibleUnits(role: UserRole, userUnitId: string): ArmyUnit[]

// 특정 부대 접근 가능 여부 확인
function canAccessUnit(role: UserRole, userUnitId: string, targetUnitId: string): boolean

// 부대 선택기용 (역할별 선택 가능 범위)
function getSelectableUnitsForRole(role: UserRole, userUnitId: string): { 
  units: ArmyUnit[]; 
  isFixed: boolean;  // BN급은 고정(선택 불가)
}
```

### 사용 예시

```typescript
// 대시보드 부대 리스트
const { user } = useAuth();
const accessibleIds = getAccessibleUnitIds(user?.role, user?.unitId);
const filteredUnits = ARMY_UNITS.filter(u => accessibleIds.includes(u.id));

// 부대 선택 드롭다운
const { units, isFixed } = getSelectableUnitsForRole(user?.role, user?.unitId);
if (isFixed) {
  // 대대급: 선택 불가, 고정 표시
} else {
  // HQ/DIV: 접근 가능 범위 내 선택 가능
}
```

### 페이지 접근 제어

```typescript
// src/lib/rbac.ts
const PAGE_ACCESS: Record<string, UserRole[]> = {
  '/dashboard': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/forecast': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/chatbot': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/reports': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/admin/notice': ['ROLE_HQ', 'ROLE_DIV'],
  '/admin/schedule': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/data': ['ROLE_HQ'],
  '/admin/users': ['ROLE_HQ', 'ROLE_DIV'],
  '/admin/settings': ['ROLE_HQ'],
};
```

### LNB 메뉴 필터링

```typescript
// src/lib/rbac.ts
const MENU_ACCESS: Record<string, UserRole[]> = {
  'dashboard': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  'forecast': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  'chatbot': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  'reports': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  'notice': ['ROLE_HQ', 'ROLE_DIV'],
  'schedule': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  'data': ['ROLE_HQ'],
  'users': ['ROLE_HQ', 'ROLE_DIV'],
  'settings': ['ROLE_HQ'],
};
```

### 세부 권한 (페이지 내 기능별)

```typescript
// 콘텐츠 수정/삭제 권한
function canEditContent(role: UserRole, authorName: string, currentUserName: string): boolean
function canDeleteContent(role: UserRole, authorName: string, currentUserName: string): boolean

// 역할 변경 권한 (HQ만)
function canChangeUserRole(role: UserRole): boolean

// 콘텐츠 생성 권한
function canCreateContent(role: UserRole, pageType: 'notice' | 'schedule' | 'report' | 'user'): boolean
```

---

*최종 업데이트: 2026-01-06*
