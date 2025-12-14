import { useState, createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { GNB } from './GNB';
import { LNB } from './LNB';
import { NoticeModal } from '../notice/NoticeModal';

// 검색 결과를 전달하기 위한 Context
interface SearchContextType {
  selectedUnitFromSearch: string | null;
  setSelectedUnitFromSearch: (unitId: string | null) => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function useSearchContext() {
  return useContext(SearchContext);
}

export function MainLayout() {
  const [showNotice, setShowNotice] = useState(false);
  const [selectedUnitFromSearch, setSelectedUnitFromSearch] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearchSelect = (unitId: string) => {
    // 대시보드로 이동하고 해당 부대 선택
    navigate('/dashboard');
    setSelectedUnitFromSearch(unitId);
    
    // 약간의 딜레이 후 초기화 (대시보드에서 처리 후)
    setTimeout(() => setSelectedUnitFromSearch(null), 100);
  };

  return (
    <SearchContext.Provider value={{ selectedUnitFromSearch, setSelectedUnitFromSearch }}>
      <div className="min-h-screen bg-background">
        <GNB 
          onNotificationClick={() => setShowNotice(true)} 
          onSearchSelect={handleSearchSelect}
        />
        
        <div className="flex">
          <LNB />
          
          <main className="flex-1 min-w-0 min-h-[calc(100vh-4rem)] overflow-x-hidden">
            <Outlet />
          </main>
        </div>

        {showNotice && (
          <NoticeModal onClose={() => setShowNotice(false)} />
        )}
      </div>
    </SearchContext.Provider>
  );
}
