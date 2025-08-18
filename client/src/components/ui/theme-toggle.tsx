import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export default function ThemeToggle({ className, size = 'default' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
    >
      <Sun className={cn(
        "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300",
        theme === 'dark' ? "rotate-90 scale-0" : "rotate-0 scale-100"
      )} />
      <Moon className={cn(
        "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300",
        theme === 'dark' ? "rotate-0 scale-100" : "rotate-90 scale-0"
      )} />
      <span className="sr-only">
        {theme === 'light' ? 'Qorong\'u rejimga o\'tish' : 'Yorqin rejimga o\'tish'}
      </span>
    </Button>
  );
}