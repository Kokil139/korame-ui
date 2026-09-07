import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Registry-idiom button (cva + cn + Tailwind), so components pulled from a
 * shadcn registry later drop in alongside it without a second button system.
 *
 * `asChild` merges props onto a single child element instead of rendering a
 * <button>, which is how a link gets button styling without nesting
 * interactive elements.
 */
const buttonVariants = cva(
    [
        'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
        'font-semibold rounded-full select-none',
        'transition-[transform,box-shadow,background-color,border-color,opacity] duration-300',
        'ease-[var(--ease-out-expo)]',
        'disabled:pointer-events-none disabled:opacity-50',
        "[&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300",
    ],
    {
        variants: {
            variant: {
                /* Primary: brand gradient with a lit top edge and a bloom that
                   grows on hover. The inner span carries a sheen sweep. */
                primary: [
                    'text-white overflow-hidden',
                    'bg-[linear-gradient(100deg,var(--brand-600),var(--brand-500)_45%,var(--coral-glow))]',
                    'shadow-[inset_0_1px_0_0_oklch(1_0_0/0.25),0_8px_30px_-8px_color-mix(in_oklch,var(--brand-500)_70%,transparent)]',
                    'hover:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.35),0_14px_44px_-10px_color-mix(in_oklch,var(--brand-500)_85%,transparent)]',
                    'active:scale-[0.98]',
                ],
                /* Solid white  the highest-contrast action on a dark canvas. */
                contrast: [
                    'bg-foreground text-background',
                    'hover:shadow-[0_10px_36px_-10px_var(--shadow-tint-strong)]',
                    'active:scale-[0.98]',
                ],
                /* Frosted secondary. */
                glass: [
                    'glass-lit text-foreground',
                    'hover:bg-elevate-strong',
                    'active:scale-[0.98]',
                ],
                /* Hairline outline, no fill. */
                outline: [
                    'border border-border text-foreground bg-transparent',
                    'hover:border-brand-400/60 hover:bg-elevate',
                    'active:scale-[0.98]',
                ],
                ghost: 'text-muted-foreground hover:text-foreground hover:bg-elevate',
                link: 'text-brand-400 underline-offset-4 hover:underline rounded-none',
            },
            size: {
                sm: 'h-9 px-4 text-sm [&_svg]:size-4',
                md: 'h-11 px-6 text-sm [&_svg]:size-4',
                lg: 'h-14 px-8 text-base [&_svg]:size-5',
                icon: 'size-11 [&_svg]:size-5',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const classes = cn(buttonVariants({ variant, size }), className);

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children, {
                ref,
                className: cn(classes, children.props.className),
                ...props,
            });
        }

        return (
            <button ref={ref} className={classes} {...props}>
                {children}
            </button>
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
