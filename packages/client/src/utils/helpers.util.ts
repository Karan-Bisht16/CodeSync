import { scroller } from 'react-scroll';
// importing data
import { constantsJSON } from '../data/constants.data';

const isDev = import.meta.env.MODE === 'DEVELOPMENT';

export const log = (...args: any[]) => {
    if (isDev) { console.log(...args) }
};

export const warn = (...args: any[]) => {
    if (isDev) { console.warn(...args) }
};

export const error = (...args: any[]) => {
    if (isDev) { console.error(...args) }
};

type scrollToArgs = {
    to: string,
    duration?: number,
    smooth?: string,
};
export const scrollTo = (args: scrollToArgs) => {
    const { to, duration, smooth = 'easeInOutQuad' } = args;
    const { transitionDuration } = constantsJSON;

    scroller.scrollTo(to, {
        duration: duration ?? transitionDuration,
        smooth: smooth,
    });
};

export const linkTo = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '__blank';
    a.rel = 'noopener noreferrer';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

export const formattedString = (text: string, length = 8) => {
    if (text.length > length) {
        return text.substring(0, 8) + '...';
    }
    return text;
};