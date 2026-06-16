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
        <circle cx="24" cy="24" r="24" fill="hsl(var(--primary))" opacity="0.1" />
        <path
          d="M24 8L27.5 20.5L40 24L27.5 27.5L24 40L20.5 27.5L8 24L20.5 20.5L24 8Z"
          fill="hsl(var(--primary))"
        />
        <circle cx="24" cy="24" r="6" fill="hsl(var(--background))" />
        <circle cx="24" cy="24" r="3" fill="hsl(var(--primary))" />
      </svg>
      {showText && (
        <span className={cn('font-bold tracking-tight text-foreground', textSizes[size])}>
          Corsair
        </span>
      )}
    </div>
  );
}
