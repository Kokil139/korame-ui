import * as React from 'react';
import { cn } from '@/lib/utils';

const fieldStyles = [
    'w-full rounded-xl bg-field px-4 text-foreground',
    'border border-border placeholder:text-muted-foreground/60',
    'transition-[border-color,box-shadow,background-color] duration-300',
    'ease-[var(--ease-out-expo)]',
    'hover:border-input',
    'focus:outline-none focus:border-brand-400/70',
    'focus:bg-field',
    'focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--brand-500)_14%,transparent)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    /* :user-invalid only fires after the user has actually interacted,
       so a pristine required field is not painted red on load. */
    'user-invalid:border-destructive/70',
];

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn(fieldStyles, 'h-12', className)} {...props} />
));
Input.displayName = 'Input';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldStyles, 'min-h-28 resize-y py-3', className)} {...props} />
));
Textarea.displayName = 'Textarea';

const Label = React.forwardRef(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            'mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground',
            className,
        )}
        {...props}
    />
));
Label.displayName = 'Label';

export { Input, Textarea, Label };
