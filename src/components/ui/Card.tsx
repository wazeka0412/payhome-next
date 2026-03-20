import Link from 'next/link';

interface CardProps {
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  tag?: string;
  meta?: string;
  title: string;
  showPlay?: boolean;
  placeholder?: string;
  onClick?: () => void;
}

export default function Card({
  href,
  imageSrc,
  imageAlt,
  tag,
  meta,
  title,
  showPlay = false,
  placeholder,
  onClick,
}: CardProps) {
  const Wrapper = href ? Link : 'div';
  const wrapperProps = href
    ? { href }
    : { role: 'button' as const, tabIndex: 0, onClick, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); } };

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            {placeholder || 'Image'}
          </div>
        )}
        {showPlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-black/50 rounded-full flex items-center justify-center text-white text-xl backdrop-blur-sm group-hover:bg-[#E8740C]/80 transition-colors">
              ▶
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {tag && (
            <span className="text-xs font-semibold text-[#E8740C] bg-[#E8740C]/10 px-2 py-0.5 rounded">
              {tag}
            </span>
          )}
          {meta && (
            <span className="text-xs text-gray-500">{meta}</span>
          )}
        </div>
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
          {title}
        </h3>
      </div>
    </Wrapper>
  );
}
