import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  MessageSquare,
  FileText,
  Settings,
  Database,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  roles?: Array<'ROLE_HQ' | 'ROLE_DIV' | 'ROLE_BN'>;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'forecast',
    label: '예보 분석',
    icon: TrendingUp,
    path: '/forecast',
  },
  {
    id: 'chatbot',
    label: '챗봇',
    icon: MessageSquare,
    path: '/chatbot',
  },
  {
    id: 'reports',
    label: '보고서',
    icon: FileText,
    path: '/reports',
  },
  {
    id: 'data',
    label: '데이터 관리',
    icon: Database,
    path: '/data',
    roles: ['ROLE_HQ'],
  },
  {
    id: 'users',
    label: '사용자 관리',
    icon: Users,
    path: '/admin/users',
    roles: ['ROLE_HQ', 'ROLE_DIV'],
  },
  {
    id: 'settings',
    label: '시스템 설정',
    icon: Settings,
    path: '/admin/settings',
    roles: ['ROLE_HQ'],
  },
];

export function LNB() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <aside
      className={cn(
        'h-[calc(100vh-4rem)] bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-16 flex-shrink-0',
        isExpanded ? 'w-56' : 'w-16'
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Menu Items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={cn(
                'flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span
                className={cn(
                  'text-sm font-medium whitespace-nowrap transition-opacity duration-200',
                  isExpanded ? 'opacity-100' : 'opacity-0'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Expand/Collapse Button */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-10"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
