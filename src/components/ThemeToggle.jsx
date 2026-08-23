import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useTheme } from '@/lib/theme';
import { springSnap } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Light/dark switch.
 *
 * The two icons cross-fade through a rotation rather than swapping instantly,
 * which reads as the same object turning over. `mode="wait"` keeps only one
 * icon mounted so they never overlap mid-transition.
 */
export default function ThemeToggle({ className }) {
    const { resolved, toggle } = useTheme();
    const reduced = useReducedMotion();
    const isDark = resolved === 'dark';
    const Icon = isDark ? Sun : Moon;

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className={cn(
                'group relative grid size-10 place-items-center overflow-hidden rounded-xl',
                'border border-border text-muted-foreground',
                'transition-colors duration-300 hover:bg-elevate hover:text-foreground',
                className,
            )}
        >
            {reduced ? (
                <Icon className="size-4" />
            ) : (
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={resolved}
                        initial={{ opacity: 0, rotate: -80, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 80, scale: 0.6 }}
                        transition={springSnap}
                        className="absolute inset-0 grid place-items-center"
                    >
                        <Icon className="size-4" />
                    </motion.span>
                </AnimatePresence>
            )}
        </button>
    );
}
