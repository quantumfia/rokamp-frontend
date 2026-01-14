import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitize';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['clean'],
  ],
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'script',
  'blockquote',
  'code-block',
  'list',
  'bullet',
  'indent',
  'align',
];

export function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder = '내용을 입력하세요',
  className,
  error,
}: RichTextEditorProps) {
  // Sanitize content before passing to parent to prevent XSS
  const handleChange = (content: string) => {
    const sanitizedContent = sanitizeHtml(content);
    onChange(sanitizedContent);
  };

  return (
    <div
      className={cn(
        'rich-text-editor rounded-md overflow-hidden',
        error && 'ring-1 ring-destructive',
        className
      )}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
