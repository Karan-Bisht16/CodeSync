import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
    Grid,
    Typography
} from '@mui/material';
import { EditorView } from '@codemirror/view';
import { langs } from '@uiw/codemirror-extensions-langs';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';
// importing data
import { carets } from '../data/carets.data';
import { homeJSON } from '../data/home.data';
// importing contexts
import { useColorContext } from '../../../contexts/Color.context';
import { useMobileContext } from '../../../contexts/Mobile.context';

export const AnimatedCodeEditor: React.FC = () => {
    const { displayCodeFileTitle, baseDisplayCode } = homeJSON;

    const { isMobile } = useMobileContext();
    const { palette, theme } = useColorContext();

    const editorTheme = useMemo(() => {
        if (palette[theme]?.mode === 'light') {
            return vscodeLight;
        }
        return vscodeDark;
    }, [palette, theme])

    const [typedStates, setTypedStates] = useState({
        alice: 0,
        bob: 0,
    });

    const typedRef = useRef(typedStates);
    const editorViewRef = useRef<EditorView | null>(null);

    const formattedCarets = useMemo(() => {
        const totalTyped = Object.values(typedStates).reduce((sum, v) => sum + v, 0);
        return carets.map(c => ({
            ...c,
            basePosition: Math.min(c.basePosition, baseDisplayCode.length + totalTyped)
        }));
    }, [typedStates, carets]);

    useEffect(() => {
        typedRef.current = typedStates;
    }, [typedStates]);

    useEffect(() => {
        const caretElements: Record<string, HTMLSpanElement> = {};
        const intervals = formattedCarets.map(user => {
            const id = user.id;
            const speed = 60000 / user.speed;

            const interval = setInterval(() => {
                setTypedStates(prev => ({
                    ...prev,
                    [id]: Math.min(prev[id as keyof typeof typedStates] + 1, user.content.length),
                }));

                const view = editorViewRef.current;
                if (!view) return;

                const typedCounts = typedRef.current;
                let shift = 0;
                for (const prev of formattedCarets) {
                    if (prev.id === id) break;
                    shift += typedCounts[prev.id as keyof typeof typedCounts] || 0;
                }
                const myTyped = typedCounts[id as keyof typeof typedCounts] || 0;
                const docPos = user.basePosition + shift + myTyped;

                const coords = view.coordsAtPos(docPos);
                if (!coords) return;
                const editorRect = view.dom.getBoundingClientRect();
                const x = coords.left - editorRect.left;
                const y = coords.top - editorRect.top;

                let container = caretElements[id];
                if (!container) {
                    container = document.createElement('span');
                    container.id = `caret-${id}`;
                    container.style.position = 'absolute';
                    container.style.pointerEvents = 'none';

                    const line = document.createElement('span');
                    line.classList.add('caret-line', 'caret-blink');
                    line.style.display = 'inline-block';
                    line.style.width = '0px';
                    line.style.height = isMobile ? '12px' : '14px';
                    line.style.borderLeft = `2px solid ${user.color}`;

                    const bubble = document.createElement('span');
                    bubble.innerText = user.name;
                    bubble.style.position = 'absolute';
                    bubble.style.bottom = '20px';
                    bubble.style.left = '0';
                    bubble.style.background = user.color;
                    bubble.style.padding = '0 4px';
                    bubble.style.borderRadius = '5px 5px 5px 0';
                    bubble.style.color = '#fff';
                    bubble.style.fontSize = isMobile ? '12px' : '14px';
                    bubble.style.userSelect = 'none';
                    bubble.style.opacity = '0.95';

                    container.appendChild(line);
                    container.appendChild(bubble);

                    document.querySelector('.editor-container')!.appendChild(container);
                    caretElements[id] = container;
                }

                container.style.left = `${x + 8}px`;
                container.style.top = `${y - 2}px`;
            }, speed);

            return { interval, id };
        });

        return () => {
            intervals.forEach(({ interval }) => clearInterval(interval));
            Object.values(caretElements).forEach(element => element.remove());
        }
    }, []);

    const renderedCode = useMemo(() => {
        let code = baseDisplayCode;
        carets.forEach(user => {
            const insertText = user.content.slice(0, typedStates[user.id as keyof typeof typedStates] || 0);
            const before = code.slice(0, user.basePosition);
            const after = code.slice(user.basePosition);
            code = before + insertText + after;
        });
        return code;
    }, [typedStates]);

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Box
                sx={{
                    position: 'relative',
                    height: '400px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 80px rgba(0,0,0,0.3)',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '40px',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        px: { xs: 1, md: 2 },
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 } }}>
                        <Box sx={{ width: { xs: 8, md: 12 }, height: { xs: 8, md: 12 }, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                        <Box sx={{ width: { xs: 8, md: 12 }, height: { xs: 8, md: 12 }, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                        <Box sx={{ width: { xs: 8, md: 12 }, height: { xs: 8, md: 12 }, borderRadius: '50%', bgcolor: '#27c93f' }} />
                    </Box>
                    <Typography variant='body2' sx={{ ml: { xs: 1, md: 2 }, fontSize: { xs: '10px', sm: '14px' }, opacity: 0.7 }}>
                        {displayCodeFileTitle}
                    </Typography>
                </Box>
                <Box sx={{ overflow: 'hidden', position: 'absolute', top: '40px', left: 0, right: 0, bottom: 0 }}>
                    <Box className='editor-container' sx={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
                        <CodeMirror
                            value={renderedCode}
                            height='100% '
                            extensions={[langs.tsx()]}
                            theme={editorTheme}
                            basicSetup={{
                                lineNumbers: true,
                                highlightActiveLineGutter: false,
                                highlightActiveLine: false,
                            }}
                            className='!h-full !text-[12px] sm:!text-[14px] !cursor-default !select-none'
                            editable={false}
                            onCreateEditor={(view) => {
                                editorViewRef.current = view;
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Grid>
    );
};