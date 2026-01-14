import { sanitizeHtml } from '@/lib/sanitize';
import { cn } from '@/lib/utils';

interface SafeHtmlContentProps {
  html: string;
  className?: string;
}

/**
 * Safely renders HTML content by sanitizing it first to prevent XSS attacks.
 * Use this component whenever you need to render user-generated HTML content.
 */
export function SafeHtmlContent({ html, className }: SafeHtmlContentProps) {
  const sanitizedHtml = sanitizeHtml(html);

  return (
    <div
      className={cn('prose prose-sm max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
