import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, Settings, User, MapPin } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/types/auth';
import { cn } from '@/lib/utils';

interface GNBProps {
  onNotificationClick: () => void;
  onSearchSelect?: (unitId: string) => void;
}

// 검색 가능한 부대 목록 (Mock 데이터)
const SEARCHABLE_UNITS = [
  { id: 'div-1', name: '제1보병사단', code: '1DIV', risk: 45 },
  { id: 'div-3', name: '제3보병사단', code: '3DIV', risk: 68 },
  { id: 'div-5', name: '제5보병사단', code: '5DIV', risk: 32 },
  { id: 'div-6', name: '제6보병사단', code: '6DIV', risk: 55 },
  { id: 'div-7', name: '제7보병사단', code: '7DIV', risk: 72 },
  { id: 'reg-1-11', name: '제1사단 11연대', code: '1-11REG', risk: 48 },
  { id: 'reg-3-9', name: '제3사단 9연대', code: '3-9REG', risk: 65 },
  { id: 'reg-7-3', name: '제7사단 3연대', code: '7-3REG', risk: 78 },
  { id: 'bn-1-11-1', name: '제1사단 11연대 1대대', code: '1-11-1BN', risk: 42 },
  { id: 'bn-7-3-2', name: '제7사단 3연대 2대대', code: '7-3-2BN', risk: 81 },
];

export function GNB({ onNotificationClick, onSearchSelect }: GNBProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 검색 결과 필터링
  const searchResults = searchQuery.trim()
    ? SEARCHABLE_UNITS.filter(
        (unit) =>
          unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          unit.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          searchQuery.includes('위험도') && unit.risk >= 50
      ).slice(0, 6)
    : [];

  // 외부 클릭 시 검색 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSelectUnit(searchResults[0]);
    }
  };

  const handleSelectUnit = (unit: typeof SEARCHABLE_UNITS[0]) => {
    setSearchQuery('');
    setShowResults(false);
    
    // 대시보드가 아니면 대시보드로 이동
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
    
    // 부대 선택 콜백 호출 (지도 이동 + 정보 패널)
    onSearchSelect?.(unit.id);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 25) return 'text-risk-safe';
    if (risk < 50) return 'text-risk-caution';
    if (risk < 75) return 'text-risk-warning';
    return 'text-risk-danger';
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-foreground tracking-tight">ROKA-SAPS</h1>
          <p className="text-xs text-muted-foreground -mt-0.5">안전사고 예측 시스템</p>
        </div>
      </div>

      {/* Search with Autocomplete */}
      <div ref={searchRef} className="flex-1 max-w-xl mx-4 relative">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="부대명 검색 (예: 1사단, 7사단 위험도)"
              className="pl-10 h-10 bg-muted/50 border-transparent focus:border-primary"
            />
          </div>
        </form>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
            {searchResults.map((unit) => (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{unit.name}</p>
                    <p className="text-xs text-muted-foreground">{unit.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">위험도</span>
                  <span className={cn('text-sm font-semibold tabular-nums', getRiskColor(unit.risk))}>
                    {unit.risk}%
                  </span>
                </div>
              </button>
            ))}
            <div className="px-4 py-2 bg-muted/30 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Enter 키를 누르면 첫 번째 결과로 이동합니다
              </p>
            </div>
          </div>
        )}

        {showResults && searchQuery.trim() && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
            <p className="text-sm text-muted-foreground text-center">
              "{searchQuery}"에 해당하는 부대가 없습니다
            </p>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={onNotificationClick}
        >
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-risk-danger rounded-full" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-10 px-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.rank} · {user?.unit}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.militaryId}</p>
              <p className="text-xs text-muted-foreground mt-1">
                권한: {user?.role && ROLE_LABELS[user.role]}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              설정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
