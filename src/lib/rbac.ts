import { UserRole } from '@/types/auth';
import { ARMY_UNITS, ArmyUnit } from '@/data/armyUnits';

// 페이지별 접근 권한
export const PAGE_ACCESS: Record<string, UserRole[]> = {
  '/dashboard': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/forecast': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/operation-risk': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/chatbot': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/reports': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/admin/notice': ['ROLE_HQ', 'ROLE_DIV'],
  '/admin/schedule': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  '/data': ['ROLE_HQ'],
  '/admin/users': ['ROLE_HQ', 'ROLE_DIV'],
  '/admin/settings': ['ROLE_HQ'],
  '/admin/fonts': ['ROLE_HQ'],
  '/admin/chatbot-starter': ['ROLE_HQ'],
};

// LNB 메뉴별 접근 권한
export const MENU_ACCESS: Record<string, UserRole[]> = {
  dashboard: ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  forecast: ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  'operation-risk': ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  chatbot: ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  reports: ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  notice: ['ROLE_HQ', 'ROLE_DIV'],
  schedule: ['ROLE_HQ', 'ROLE_DIV', 'ROLE_BN'],
  data: ['ROLE_HQ'],
  users: ['ROLE_HQ', 'ROLE_DIV'],
  settings: ['ROLE_HQ'],
  fonts: ['ROLE_HQ'],
};

// 페이지 접근 권한 확인
export function canAccessPage(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;
  
  // 정확한 경로 매칭
  if (PAGE_ACCESS[path]) {
    return PAGE_ACCESS[path].includes(role);
  }
  
  // 부분 경로 매칭 (예: /admin/notice/new -> /admin/notice)
  const basePaths = Object.keys(PAGE_ACCESS).sort((a, b) => b.length - a.length);
  for (const basePath of basePaths) {
    if (path.startsWith(basePath + '/') || path === basePath) {
      return PAGE_ACCESS[basePath].includes(role);
    }
  }
  
  return true; // 정의되지 않은 경로는 접근 허용
}

// 메뉴 접근 권한 확인
export function canAccessMenu(role: UserRole | undefined, menuId: string): boolean {
  if (!role) return false;
  return MENU_ACCESS[menuId]?.includes(role) ?? true;
}

// 역할별 데이터 접근 범위 설명
export const ROLE_SCOPE_LABELS: Record<UserRole, string> = {
  'ROLE_HQ': '전군',
  'ROLE_DIV': '예하 부대',
  'ROLE_BN': '본인 부대',
};

// ============================================
// 부대 데이터 필터링 (역할별)
// ============================================

/**
 * 특정 부대의 모든 하위 부대 ID를 반환 (자신 포함)
 */
export function getSubordinateUnitIds(unitId: string): string[] {
  const result: string[] = [unitId];
  
  const findChildren = (parentId: string) => {
    const children = ARMY_UNITS.filter(u => u.parentId === parentId);
    for (const child of children) {
      result.push(child.id);
      findChildren(child.id);
    }
  };
  
  findChildren(unitId);
  return result;
}

/**
 * 특정 부대의 상위 부대 체인을 반환 (자신 포함)
 */
export function getParentUnitChain(unitId: string): string[] {
  const result: string[] = [];
  let currentId: string | null = unitId;
  
  while (currentId) {
    result.push(currentId);
    const unit = ARMY_UNITS.find(u => u.id === currentId);
    currentId = unit?.parentId ?? null;
  }
  
  return result;
}

/**
 * 역할과 소속 부대에 따라 접근 가능한 부대 ID 목록 반환
 * - ROLE_HQ: 전체 부대
 * - ROLE_DIV: 소속 부대 + 예하 부대
 * - ROLE_BN: 소속 부대만
 */
export function getAccessibleUnitIds(role: UserRole | undefined, userUnitId: string | undefined): string[] {
  if (!role || !userUnitId) return [];
  
  switch (role) {
    case 'ROLE_HQ':
      // 전체 부대
      return ARMY_UNITS.map(u => u.id);
    
    case 'ROLE_DIV':
      // 소속 부대 + 예하 부대
      return getSubordinateUnitIds(userUnitId);
    
    case 'ROLE_BN':
      // 소속 부대만
      return [userUnitId];
    
    default:
      return [];
  }
}

/**
 * 역할과 소속 부대에 따라 접근 가능한 ArmyUnit 목록 반환
 */
export function getAccessibleUnits(role: UserRole | undefined, userUnitId: string | undefined): ArmyUnit[] {
  const accessibleIds = getAccessibleUnitIds(role, userUnitId);
  return ARMY_UNITS.filter(u => accessibleIds.includes(u.id));
}

/**
 * 특정 부대가 접근 가능한지 확인
 */
export function canAccessUnit(role: UserRole | undefined, userUnitId: string | undefined, targetUnitId: string): boolean {
  if (!role || !userUnitId) return false;
  
  const accessibleIds = getAccessibleUnitIds(role, userUnitId);
  return accessibleIds.includes(targetUnitId);
}

/**
 * 부대 선택기용: 역할에 따라 선택 가능한 부대 트리 필터링
 * - ROLE_HQ: 전체 트리
 * - ROLE_DIV: 소속 부대 기준 하위 트리
 * - ROLE_BN: 소속 부대만 (선택 불가, 고정)
 */
export function getSelectableUnitsForRole(
  role: UserRole | undefined, 
  userUnitId: string | undefined
): { units: ArmyUnit[]; isFixed: boolean } {
  if (!role || !userUnitId) {
    return { units: [], isFixed: true };
  }
  
  switch (role) {
    case 'ROLE_HQ':
      return { 
        units: ARMY_UNITS, 
        isFixed: false 
      };
    
    case 'ROLE_DIV':
      return { 
        units: getAccessibleUnits(role, userUnitId), 
        isFixed: false 
      };
    
    case 'ROLE_BN':
      // 대대급은 자기 부대만 볼 수 있고 변경 불가
      const ownUnit = ARMY_UNITS.find(u => u.id === userUnitId);
      return { 
        units: ownUnit ? [ownUnit] : [], 
        isFixed: true 
      };
    
    default:
      return { units: [], isFixed: true };
  }
}

// ============================================
// 세부 권한 (페이지 내 기능별)
// ============================================

// 본인 작성 여부 확인 (작성자 이름 기반)
export function isOwnContent(role: UserRole | undefined, authorName: string, currentUserName: string): boolean {
  if (!role) return false;
  if (role === 'ROLE_HQ') return true; // HQ는 모든 콘텐츠 수정/삭제 가능
  return authorName === currentUserName;
}

// 수정/삭제 권한 (공지, 보고서 등)
export function canEditContent(role: UserRole | undefined, authorName: string, currentUserName: string): boolean {
  if (!role) return false;
  if (role === 'ROLE_HQ') return true;
  return authorName === currentUserName;
}

export function canDeleteContent(role: UserRole | undefined, authorName: string, currentUserName: string): boolean {
  return canEditContent(role, authorName, currentUserName);
}

// 사용자 관리: 역할 변경 권한
export function canChangeUserRole(role: UserRole | undefined): boolean {
  return role === 'ROLE_HQ';
}

// 콘텐츠 생성 권한
export function canCreateContent(role: UserRole | undefined, pageType: 'notice' | 'schedule' | 'report' | 'user'): boolean {
  if (!role) return false;
  
  switch (pageType) {
    case 'notice':
      return role === 'ROLE_HQ' || role === 'ROLE_DIV';
    case 'schedule':
      return true; // 모든 역할 가능
    case 'report':
      return true; // 모든 역할 가능
    case 'user':
      return role === 'ROLE_HQ' || role === 'ROLE_DIV';
    default:
      return false;
  }
}
