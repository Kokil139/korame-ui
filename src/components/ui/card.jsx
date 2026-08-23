import * as React from 'react';
import { cn } from '@/lib/utils';

/** Frosted surface primitive. `lit` adds the hover glow ring. */
const Card = React.forwardRef(({ className, lit = true, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            lit ? 'glass-lit' : 'glass',
            'rounded-3xl',
            className,
        )}
        {...props}
    />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 p-7', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, as: Tag = 'h3', ...props }, ref) => (
    <Tag
        ref={ref}
        className={cn('font-heading text-2xl font-bold tracking-tight text-foreground', className)}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-relaxed text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-7 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-7 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
