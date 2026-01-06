import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessPage } from '@/lib/rbac';
import { toast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
}

export function RoleProtectedRoute({ children }: RoleProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const hasShownToast = useRef(false);

  const hasAccess = canAccessPage(user?.role, location.pathname);

  useEffect(() => {
    if (isAuthenticated && !hasAccess && !hasShownToast.current) {
      hasShownToast.current = true;
      toast({
        title: '접근 권한 없음',
        description: '해당 페이지에 접근할 권한이 없습니다.',
        variant: 'destructive',
      });
    }
  }, [isAuthenticated, hasAccess]);

  // Reset toast flag when path changes
  useEffect(() => {
    hasShownToast.current = false;
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
