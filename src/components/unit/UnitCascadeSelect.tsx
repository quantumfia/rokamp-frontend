import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getChildUnits, getUnitPath, getUnitById, ArmyUnit } from '@/data/armyUnits';

interface UnitCascadeSelectProps {
  value?: string;
  onChange: (unitId: string) => void;
  placeholder?: string;
  showFullPath?: boolean;
}

export function UnitCascadeSelect({ 
  value, 
  onChange, 
  placeholder = '부대 선택',
  showFullPath = true 
}: UnitCascadeSelectProps) {
  const [selections, setSelections] = useState<string[]>([]);
  
  // value가 변경되면 selections 업데이트
  useEffect(() => {
    if (value) {
      const path = getUnitPath(value);
      setSelections(path.map(u => u.id));
    } else {
      setSelections([]);
    }
  }, [value]);

  const handleSelect = (level: number, unitId: string) => {
    const newSelections = [...selections.slice(0, level), unitId];
    setSelections(newSelections);
    onChange(unitId);
  };

  const handleClear = (level: number) => {
    if (level === 0) {
      setSelections([]);
      onChange('');
    } else {
      const newSelections = selections.slice(0, level);
      setSelections(newSelections);
      onChange(newSelections[newSelections.length - 1] || '');
    }
  };

  // 각 레벨별로 선택 가능한 부대 목록 생성
  const getLevelOptions = (level: number): ArmyUnit[] => {
    if (level === 0) {
      return getChildUnits(null); // 최상위 (육군본부)
    }
    const parentId = selections[level - 1];
    if (!parentId) return [];
    return getChildUnits(parentId);
  };

  // 현재 표시할 드롭다운 개수
  const getVisibleLevels = (): number => {
    if (selections.length === 0) return 1;
    const lastSelected = selections[selections.length - 1];
    const hasMoreChildren = getChildUnits(lastSelected).length > 0;
    return selections.length + (hasMoreChildren ? 1 : 0);
  };

  const visibleLevels = getVisibleLevels();

  // 선택된 부대의 전체 경로 표시
  const getDisplayPath = (): string => {
    if (selections.length === 0) return '';
    return selections
      .map(id => getUnitById(id)?.name || '')
      .filter(Boolean)
      .join(' > ');
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: visibleLevels }).map((_, level) => {
          const options = getLevelOptions(level);
          const currentValue = selections[level] || '';
          
          // 옵션이 없으면 표시하지 않음
          if (options.length === 0 && level > 0) return null;
          
          return (
            <div key={level} className="flex items-center gap-1">
              {level > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <Select
                value={currentValue}
                onValueChange={(val) => handleSelect(level, val)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={level === 0 ? placeholder : '선택...'} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {level === 0 && (
                    <SelectItem value="all">전체 부대</SelectItem>
                  )}
                  {options.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
      
      {showFullPath && selections.length > 0 && (
        <p className="text-xs text-muted-foreground pl-1">
          {getDisplayPath()}
        </p>
      )}
    </div>
  );
}
