import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Upload, Download, KeyRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UnitCascadeSelect } from '@/components/unit/UnitCascadeSelect';
import { getUnitById, getAllDescendants } from '@/data/armyUnits';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  militaryId: string;
  name: string;
  rank: string;
  unitId: string;
  role: string;
  status: 'active' | 'inactive';
}

const MOCK_USERS: User[] = [
  { id: '1', militaryId: 'HQ001', name: '김철수', rank: '대령', unitId: 'hq', role: 'ROLE_HQ', status: 'active' },
  { id: '2', militaryId: 'DIV001', name: '이영희', rank: '준장', unitId: 'div-1', role: 'ROLE_DIV', status: 'active' },
  { id: '3', militaryId: 'DIV002', name: '박민호', rank: '대령', unitId: 'div-3', role: 'ROLE_DIV', status: 'active' },
  { id: '4', militaryId: 'BN001', name: '최지훈', rank: '중령', unitId: 'bn-1-1', role: 'ROLE_BN', status: 'active' },
  { id: '5', militaryId: 'BN002', name: '정수민', rank: '중령', unitId: 'bn-1-2', role: 'ROLE_BN', status: 'inactive' },
  { id: '6', militaryId: 'CORPS001', name: '홍길동', rank: '중장', unitId: 'corps-1', role: 'ROLE_DIV', status: 'active' },
  { id: '7', militaryId: 'REG001', name: '김대위', rank: '대령', unitId: 'reg-11', role: 'ROLE_BN', status: 'active' },
  { id: '8', militaryId: 'SF001', name: '강특전', rank: '중령', unitId: 'bde-sf-1', role: 'ROLE_BN', status: 'active' },
  { id: '9', militaryId: 'GOC001', name: '이작전', rank: '대장', unitId: 'goc', role: 'ROLE_HQ', status: 'active' },
];

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('');
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ROLE_HQ':
        return '육군본부';
      case 'ROLE_DIV':
        return '사단급';
      case 'ROLE_BN':
        return '대대급';
      default:
        return role;
    }
  };

  const getUnitName = (unitId: string) => {
    const unit = getUnitById(unitId);
    return unit?.name ?? unitId;
  };

  const handleBulkUpload = () => {
    toast({
      title: '업로드 완료',
      description: '사용자 일괄 등록이 완료되었습니다. 소속 부대에 따라 권한이 자동 설정되었습니다.',
    });
    setShowBulkUpload(false);
  };

  const handleResetPassword = (userName: string) => {
    toast({
      title: '비밀번호 초기화',
      description: `${userName}님의 비밀번호가 초기화되었습니다.`,
    });
  };

  const handleDownloadTemplate = () => {
    toast({
      title: '템플릿 다운로드',
      description: '사용자 일괄 등록 템플릿이 다운로드됩니다.',
    });
  };

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.includes(searchQuery) ||
      user.militaryId.includes(searchQuery) ||
      getUnitName(user.unitId).includes(searchQuery);
    
    let matchesUnit = true;
    if (selectedUnitFilter && selectedUnitFilter !== 'all') {
      const descendants = getAllDescendants(selectedUnitFilter);
      const descendantIds = descendants.map(u => u.id);
      matchesUnit = user.unitId === selectedUnitFilter || descendantIds.includes(user.unitId);
    }
    
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">사용자 관리</h1>
          <p className="text-muted-foreground">시스템 사용자 계정 및 권한 관리</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                일괄 등록
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>사용자 일괄 등록</DialogTitle>
                <DialogDescription>
                  엑셀 파일로 여러 사용자를 한 번에 등록합니다. 
                  소속 부대 코드에 따라 데이터 접근 권한이 자동 설정됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('excel-upload')?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">엑셀 파일을 드래그하거나 클릭하여 업로드</p>
                  <p className="text-xs text-muted-foreground mt-1">XLSX, XLS 형식 지원</p>
                  <input id="excel-upload" type="file" accept=".xlsx,.xls" className="hidden" />
                </div>
                <Button variant="outline" className="w-full gap-2" onClick={handleDownloadTemplate}>
                  <Download className="w-4 h-4" />
                  템플릿 다운로드
                </Button>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• 필수 필드: 군번, 이름, 계급, 소속부대코드</p>
                  <p>• 소속 부대 코드에 따라 접근 권한 자동 설정</p>
                  <p>• 초기 비밀번호는 군번+생년월일 형식</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowBulkUpload(false)}>취소</Button>
                <Button onClick={handleBulkUpload}>업로드</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            사용자 등록
          </Button>
        </div>
      </div>

      {/* Stats - 아이콘 없이 깔끔하게 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">전체 사용자</p>
            <p className="text-2xl font-bold mt-1">156</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">활성 계정</p>
            <p className="text-2xl font-bold mt-1">148</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">소속 부대</p>
            <p className="text-2xl font-bold mt-1">24</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle>사용자 목록</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="이름, 군번, 부대 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            {/* 계층형 부대 필터 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">부대 필터:</span>
              <UnitCascadeSelect
                value={selectedUnitFilter}
                onChange={setSelectedUnitFilter}
                placeholder="육군본부"
                showFullPath={false}
              />
            </div>
          </div>
        </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>군번</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>계급</TableHead>
              <TableHead>소속 부대</TableHead>
              <TableHead>권한</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{user.militaryId}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.rank}</TableCell>
                <TableCell>{getUnitName(user.unitId)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {getRoleLabel(user.role)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'active' ? 'bg-risk-safe' : 'bg-muted-foreground'
                      }`} />
                      <span className="text-sm">
                        {user.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>권한 변경</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user.name)}>
                          <KeyRound className="w-4 h-4 mr-2" />
                          비밀번호 초기화
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">계정 비활성화</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
