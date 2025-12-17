import { useState, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputType {
  id: string;
  label: string;
  content: ReactNode;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  inputTypes: InputType[];
  onSubmit?: () => void;
  submitLabel?: string;
  isSubmitDisabled?: boolean;
}

export function AddModal({
  isOpen,
  onClose,
  title,
  description,
  inputTypes,
  onSubmit,
  submitLabel = '추가',
  isSubmitDisabled = false,
}: AddModalProps) {
  const [selectedType, setSelectedType] = useState(inputTypes[0]?.id);

  if (!isOpen) return null;

  const currentContent = inputTypes.find(t => t.id === selectedType)?.content;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in zoom-in-95 fade-in duration-200">
        <div className="bg-card border border-border rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 -m-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Type Selector (only if multiple types) */}
          {inputTypes.length > 1 && (
            <div className="px-5 pt-4">
              <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                {inputTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                      selectedType === type.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-5">
            {currentContent}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors"
            >
              취소
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-md transition-colors',
                isSubmitDisabled
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
