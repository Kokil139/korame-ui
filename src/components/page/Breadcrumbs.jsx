import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumb trail.
 *
 * `trail` is [{ name, path }] from the root inward, excluding Home, which is
 * prepended here — the same shape `breadcrumbNode()` in lib/seo.js takes, so
 * the visible trail and the BreadcrumbList structured data are always built
 * from one array. Google requires the two to agree.
 *
 * The last crumb is the current page and is not a link.
 */
export default function Breadcrumbs({ trail }) {
    const items = [{ name: 'Home', path: '/' }, ...trail];

    return (
        <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={item.path} className="flex items-center gap-1">
                            {isLast ? (
                                <span aria-current="page" className="text-foreground">
                                    {item.name}
                                </span>
                            ) : (
                                <>
                                    <Link
                                        to={item.path}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {item.name}
                                    </Link>
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="size-3.5 opacity-60"
                                    />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
