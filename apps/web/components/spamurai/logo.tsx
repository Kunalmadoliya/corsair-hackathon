import { cn } from '~/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = { sm: 24, md: 32, lg: 48 };
  const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background circle */}
        <circle cx="24" cy="24" r="23" fill="hsl(0 0% 6%)" stroke="hsl(0 72% 51%)" strokeWidth="1.5" />
        {/* Helmet crest / top */}
        <path d="M24 6 L28 14 L24 11 L20 14 Z" fill="hsl(0 72% 51%)" />
        {/* Helmet body */}
        <path d="M16 18 Q16 12 24 12 Q32 12 32 18 L30 22 L18 22 Z" fill="hsl(0 0% 12%)" stroke="hsl(0 72% 51%)" strokeWidth="1" />
        {/* Face guard / visor */}
        <rect x="18" y="22" width="12" height="6" rx="1" fill="hsl(0 0% 8%)" stroke="hsl(0 72% 51%)" strokeWidth="0.8" />
        {/* Eye slit */}
        <rect x="21" y="24" width="6" height="1.5" rx="0.5" fill="hsl(0 72% 51%)" />
        {/* Neck guard */}
        <path d="M16 22 L14 32 L24 36 L34 32 L32 22" fill="hsl(0 0% 10%)" stroke="hsl(0 72% 51%)" strokeWidth="0.8" />
        {/* Side horns */}
        <path d="M14 18 L10 14 L12 20 Z" fill="hsl(0 72% 51%)" opacity="0.7" />
        <path d="M34 18 L38 14 L36 20 Z" fill="hsl(0 72% 51%)" opacity="0.7" />
        {/* Center decoration */}
        <circle cx="24" cy="16" r="1.5" fill="hsl(0 72% 51%)" />
      </svg>
      {showText && (
        <span className={cn('font-bold tracking-tight text-foreground', textSizes[size])}>
          Spamurai
        </span>
      )}
    </div>
  );
}
