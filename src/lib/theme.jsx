import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { flushSync } from 'react-dom';

const STORAGE_KEY = 'korame-theme';
const ThemeContext = createContext(null);

/** Read the stored choice, tolerating a blocked or empty localStorage. */
function readStored() {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
    } catch {
        return 'system';
    }
}

const systemPrefersDark = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * Theme state.
 *
 * Three-state: 'light' | 'dark' | 'system'. The *resolved* value is what the
 * document actually wears. The blocking script in index.html has already
 * applied the correct class before first paint, so this provider adopts that
 * state rather than causing a second, visible swap on mount.
 */
export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(readStored);
    const [resolved, setResolved] = useState(() =>
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark')
            ? 'dark'
            : 'light',
    );

    /**
     * Swap the palette.
     *
     * Preferred path is the View Transitions API: the browser snapshots the
     * whole page before and after, then cross-fades the two images. That is a
     * genuinely smooth swap — including gradients, shadows, images and canvas
     * — which a CSS `transition` on colour properties can never be, because
     * it only interpolates the handful of properties you list and pops
     * everything else.
     *
     * `flushSync` is required: `startViewTransition` snapshots "after" as
     * soon as its callback returns, and React would otherwise batch the state
     * update to a later tick, so the icon swap would miss the transition.
     *
     * Fallback for browsers without the API (and the reduced-motion path)
     * is the scoped `.theme-switching` class in index.css.
     */
    const apply = useCallback((next) => {
        const isDark = next === 'dark' || (next === 'system' && systemPrefersDark());
        const root = document.documentElement;

        const commit = () => {
            root.classList.toggle('dark', isDark);
            setResolved(isDark ? 'dark' : 'light');
        };

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!reduced && typeof document.startViewTransition === 'function') {
            document.startViewTransition(() => flushSync(commit));
            return;
        }

        /* Scoped to the swap, then removed — leaving a transition on every
           element permanently makes scrolling feel sticky. */
        root.classList.add('theme-switching');
        commit();
        window.setTimeout(() => root.classList.remove('theme-switching'), 450);
    }, []);

    const setTheme = useCallback(
        (next) => {
            setThemeState(next);
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch {
                /* Private mode or blocked storage — the choice just won't persist. */
            }
            apply(next);
        },
        [apply],
    );

    /* Follow the OS while the user is on 'system'. */
    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => apply('system');
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, [theme, apply]);

    const value = useMemo(
        () => ({
            theme,
            resolved,
            setTheme,
            toggle: () => setTheme(resolved === 'dark' ? 'light' : 'dark'),
        }),
        [theme, resolved, setTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
    return ctx;
}
