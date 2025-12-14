import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginBackground } from '@/components/login/LoginBackground';
import { LoginForm } from '@/components/login/LoginForm';
import { NoticeModal } from '@/components/notice/NoticeModal';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    // Check if we should show notice
    const hideUntil = localStorage.getItem('hideNoticeUntil');
    const shouldShow = !hideUntil || new Date(hideUntil) < new Date();
    
    if (shouldShow) {
      setShowNotice(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleNoticeClose = () => {
    setShowNotice(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginBackground />
      <LoginForm onSuccess={handleLoginSuccess} />
      
      {showNotice && (
        <NoticeModal onClose={handleNoticeClose} />
      )}
    </div>
  );
}
