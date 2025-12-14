import { useState } from 'react';
import { Shield, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [militaryId, setMilitaryId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!militaryId || !password) {
      setError('군번과 비밀번호를 입력해주세요.');
      return;
    }

    const success = await login(militaryId, password);
    
    if (success) {
      onSuccess();
    } else {
      setError('군번 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          ROKA-SAPS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          육군 안전사고 예측 시스템
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="militaryId" className="text-sm font-medium">
              군번 (ID)
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="militaryId"
                type="text"
                value={militaryId}
                onChange={(e) => setMilitaryId(e.target.value)}
                placeholder="군번을 입력하세요"
                className="pl-10 h-12"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="pl-10 h-12"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                인증 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-3">
            테스트 계정
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded bg-muted text-center">
              <div className="font-medium text-foreground">육본</div>
              <div className="text-muted-foreground">HQ001</div>
            </div>
            <div className="p-2 rounded bg-muted text-center">
              <div className="font-medium text-foreground">사단</div>
              <div className="text-muted-foreground">DIV001</div>
            </div>
            <div className="p-2 rounded bg-muted text-center">
              <div className="font-medium text-foreground">대대</div>
              <div className="text-muted-foreground">BN001</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            비밀번호: admin123
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        © 2024 대한민국 육군. All rights reserved.
      </p>
    </div>
  );
}
