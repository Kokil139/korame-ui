import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** Small eyebrow/pill label. Used for section kickers and tag chips. */
const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide whitespace-nowrap transition-colors duration-300',
    {
        variants: {
            variant: {
                brand: 'bg-brand-500/10 text-brand-300 border border-brand-500/25',
                cyan: 'bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/25',
                glass: 'glass text-muted-foreground',
                outline: 'border border-border text-muted-foreground',
                solid: 'bg-foreground text-background',
            },
            size: {
                sm: 'px-2.5 py-1 text-[11px]',
                md: 'px-3.5 py-1.5 text-xs',
            },
        },
        defaultVariants: { variant: 'brand', size: 'md' },
    },
);

const Badge = React.forwardRef(({ className, variant, size, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
));
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
