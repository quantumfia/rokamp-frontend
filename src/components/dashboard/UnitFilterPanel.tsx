import { useState } from 'react';
import { Filter, ChevronDown, Building2, AlertTriangle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface UnitFilterPanelProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  divisions: string[];
  riskLevels: string[];
  unitTypes: string[];
}

const DIVISIONS: FilterOption[] = [
  { id: 'div-1', label: '제1사단', count: 8 },
  { id: 'div-3', label: '제3사단', count: 6 },
  { id: 'div-5', label: '제5사단', count: 7 },
  { id: 'div-7', label: '제7사단', count: 5 },
  { id: 'div-9', label: '제9사단', count: 4 },
];

const RISK_LEVELS: FilterOption[] = [
  { id: 'high', label: '고위험 (60% 이상)', count: 3 },
  { id: 'medium', label: '중위험 (30-60%)', count: 12 },
  { id: 'low', label: '저위험 (30% 미만)', count: 15 },
];

const UNIT_TYPES: FilterOption[] = [
  { id: 'infantry', label: '보병', count: 18 },
  { id: 'armor', label: '기갑', count: 6 },
  { id: 'artillery', label: '포병', count: 4 },
  { id: 'engineer', label: '공병', count: 2 },
];

export function UnitFilterPanel({ onFilterChange }: UnitFilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    divisions: [],
    riskLevels: [],
    unitTypes: [],
  });

  const [openSections, setOpenSections] = useState({
    divisions: true,
    riskLevels: true,
    unitTypes: true,
  });

  const handleFilterChange = (category: keyof FilterState, id: string) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      
      const newFilters = { ...prev, [category]: updated };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const emptyFilters = { divisions: [], riskLevels: [], unitTypes: [] };
    setFilters(emptyFilters);
    onFilterChange?.(emptyFilters);
  };

  const totalFilters = filters.divisions.length + filters.riskLevels.length + filters.unitTypes.length;

  const FilterSection = ({
    title,
    icon: Icon,
    options,
    category,
    isOpen,
    onToggle,
  }: {
    title: string;
    icon: React.ElementType;
    options: FilterOption[];
    category: keyof FilterState;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted/50 rounded-md transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 py-2 space-y-1">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/30 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters[category].includes(option.id)}
                  onCheckedChange={() => handleFilterChange(category, option.id)}
                />
                <span className="text-sm text-foreground">{option.label}</span>
              </div>
              {option.count !== undefined && (
                <span className="text-xs text-muted-foreground tabular-nums">{option.count}</span>
              )}
            </label>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">필터</span>
          {totalFilters > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {totalFilters}
            </span>
          )}
        </div>
        {totalFilters > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllFilters}>
            초기화
          </Button>
        )}
      </div>

      {/* 필터 섹션들 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <FilterSection
          title="사단"
          icon={Building2}
          options={DIVISIONS}
          category="divisions"
          isOpen={openSections.divisions}
          onToggle={() => setOpenSections((prev) => ({ ...prev, divisions: !prev.divisions }))}
        />
        <FilterSection
          title="위험도"
          icon={AlertTriangle}
          options={RISK_LEVELS}
          category="riskLevels"
          isOpen={openSections.riskLevels}
          onToggle={() => setOpenSections((prev) => ({ ...prev, riskLevels: !prev.riskLevels }))}
        />
        <FilterSection
          title="부대 유형"
          icon={Shield}
          options={UNIT_TYPES}
          category="unitTypes"
          isOpen={openSections.unitTypes}
          onToggle={() => setOpenSections((prev) => ({ ...prev, unitTypes: !prev.unitTypes }))}
        />
      </div>

      {/* 요약 */}
      <div className="px-4 py-3 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground">
          전체 <span className="font-medium text-foreground">30</span>개 부대 중{' '}
          <span className="font-medium text-foreground">30</span>개 표시
        </div>
      </div>
    </div>
  );
}
