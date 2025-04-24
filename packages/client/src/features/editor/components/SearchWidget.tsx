import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Box, Checkbox, Grid } from '@mui/material';
import {
    closeSearchPanel,
    findNext,
    findPrevious,
    replaceAll,
    replaceNext,
    SearchQuery,
    selectMatches,
    setSearchQuery
} from '@codemirror/search';
import { EditorView } from '@uiw/react-codemirror';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing type
import type { Panel } from '@uiw/react-codemirror';
// importing providers
import { ColorProvider } from '../../../contexts/Color.context';
import { SettingsProvider } from '../../settings/contexts/Settings.context';
// importing components
import { ToolTip } from '../../../components/ToolTip';

type SearchWidgetIconButtonProps = {
    title: string,
    name: string,
    value: boolean,
    onChange(event: React.ChangeEvent<HTMLInputElement>): void,
    icon: string,
};

const SearchWidgetIconButton: React.FC<SearchWidgetIconButtonProps> = (props) => {
    const { title, name, value, onChange, icon } = props;

    return (
        <ToolTip title={title}>
            <Checkbox
                name={name}
                checked={value}
                onChange={onChange}
                icon={
                    <Box sx={{ color: 'text.secondary', bgcolor: 'background.paper', p: 0, m: 0, border: '1px solid', borderColor: 'background.paper' }}>
                        <i className={`codicon ${icon} text-inherit bg-inherit px-1`} />
                    </Box>
                }
                checkedIcon={
                    <Box sx={{ color: 'primary.contrastText', bgcolor: 'primary.light', p: 0, m: 0, border: '1px solid', borderColor: 'primary.dark', borderRadius: '4px' }}>
                        <i className={`codicon ${icon} text-inherit bg-inherit px-1 rounded-[4px]`} />
                    </Box>
                }
                sx={{ position: 'relative', right: '8px', p: 0, m: 0, borderRadius: 0 }}
            />
        </ToolTip>
    );
};

type SearchWidgetButtonProps = {
    title: string,
    onClick(event: React.MouseEvent<HTMLButtonElement>): void,
    icon: string,
};

const SearchWidgetButton: React.FC<SearchWidgetButtonProps> = (props) => {
    const { title, onClick, icon } = props;

    return (
        <ToolTip title={title}>
            <button
                onClick={onClick}
                className='mt-1 hover:opacity-80'
            >
                <i className={`codicon ${icon} text-inherit bg-inherit px-1`} />
            </button>
        </ToolTip>
    );
};

type SearchWidgetProps = {
    view: EditorView,
    onClose(): void,
};

const SearchWidget: React.FC<SearchWidgetProps> = (props) => {
    const { view, onClose } = props;

    const { navbarHeight } = constantsJSON;

    const findFieldRef = useRef<HTMLInputElement | null>(null);
    const replaceFieldRef = useRef<HTMLInputElement | null>(null);

    const [searchParams, setSearchParams] = useState({
        search: '',
        replace: '',
        caseSensitive: false,
        regexp: false,
        wholeWord: false,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;

        const newValue = type === 'checkbox' ? checked : value;

        const updatedParams = {
            ...searchParams,
            [name]: newValue,
        };

        setSearchParams(updatedParams);
    };

    const updateSearch = (search: string, caseSensitive: boolean) => {
        const searchQuery = new SearchQuery({
            search,
            caseSensitive,
        });

        view.dispatch({ effects: setSearchQuery.of(searchQuery) });
    };

    const selectSearch = () => {
        const input = document.getElementById('search-field');
        if (input instanceof HTMLInputElement) {
            input.focus();
            input.select();
        }
    };

    // TODO: use one of the libraries + settings.editorSearchKeymap
    const handleFindInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                findPrevious(view);
            } else {
                findNext(view);
            }
        } else if (event.key === 'Tab') {
            event.preventDefault();
            event.stopPropagation();
            if (replaceFieldRef.current) {
                replaceFieldRef.current.focus();
            }
        }
    };

    const handleReplaceInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const isCtrlOrCmd = event.ctrlKey || event.metaKey;

        if (event.key === 'Enter') {
            if (isCtrlOrCmd && event.altKey) {
                replaceAll(view);
            } else {
                replaceNext(view);
            }
        } else if (event.key === 'Tab') {
            event.preventDefault();
            event.stopPropagation();
            if (findFieldRef.current) {
                findFieldRef.current.focus();
            }
        }
    };

    useEffect(() => {
        const newQuery = new SearchQuery({
            search: searchParams.search,
            replace: searchParams.replace,
            caseSensitive: searchParams.caseSensitive,
            regexp: searchParams.regexp,
            wholeWord: searchParams.wholeWord,
        });

        view.dispatch({ effects: setSearchQuery.of(newQuery) });
    }, [searchParams, view]);


    return (
        <Box
            className='custom-search-panel'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: navbarHeight,
                right: { xs: 0, sm: navbarHeight },
                color: 'text.primary',
                bgcolor: 'background.default',
            }}
        >
            <Grid container spacing={{ xs: 4, sm: 8, md: 10 }}>
                <Grid size={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.paper' }}>
                        <input
                            id='search-field'
                            main-field='true'
                            name='search'
                            type='text'
                            autoFocus={true}
                            autoComplete='off'
                            ref={findFieldRef}
                            value={searchParams.search}
                            onChange={(event) => {
                                const value = event.target.value;
                                handleChange(event);
                                updateSearch(value, searchParams.caseSensitive);
                            }}
                            onKeyDown={handleFindInput}
                            placeholder='Find'
                            className='w-24 sm:w-40 bg-inherit px-2 py-1 outline-none'
                        />
                        <SearchWidgetIconButton
                            title='Match Case'
                            name='caseSensitive'
                            value={searchParams.caseSensitive}
                            onChange={(event) => {
                                handleChange(event);
                                updateSearch(searchParams.search, event.target.checked);
                                selectSearch();
                            }}
                            icon='codicon-case-sensitive'
                        />
                        <SearchWidgetIconButton
                            title='Match Whole Word'
                            name='wholeWord'
                            value={searchParams.wholeWord}
                            onChange={(event) => {
                                handleChange(event);
                                updateSearch(searchParams.search, searchParams.caseSensitive);
                                selectSearch();
                            }}
                            icon='codicon-whole-word'
                        />
                        <SearchWidgetIconButton
                            title='Use Regular Expression'
                            name='regexp'
                            value={searchParams.regexp}
                            onChange={(event) => {
                                handleChange(event);
                                updateSearch(searchParams.search, searchParams.caseSensitive);
                                selectSearch();
                            }}
                            icon='codicon-regex'
                        />
                    </Box>
                </Grid>
                <Grid size={4}>
                    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center', mr: 2 }}>
                        <SearchWidgetButton
                            title='Previous Match (Shift+Enter)'
                            onClick={(event) => {
                                event.preventDefault()
                                findPrevious(view)
                            }}
                            icon='codicon-arrow-up'
                        />
                        <SearchWidgetButton
                            title='Next Match (Enter)'
                            onClick={(event) => {
                                event.preventDefault()
                                findNext(view)
                            }}
                            icon='codicon-arrow-down'
                        />
                        <SearchWidgetButton
                            title='Close'
                            onClick={onClose}
                            icon='codicon-close'
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={{ xs: 4, sm: 8, md: 10 }}>
                <Grid size={8}>
                    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center', bgcolor: 'background.paper' }}>
                        <input
                            name='replace'
                            type='text'
                            autoComplete='off'
                            ref={replaceFieldRef}
                            value={searchParams.replace}
                            onChange={(event) => handleChange(event)}
                            onKeyDown={handleReplaceInput}
                            placeholder='Replace'
                            className='w-24 sm:w-40 bg-inherit px-2 py-1 outline-none'
                        />
                    </Box>
                </Grid>
                <Grid size={4}>
                    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center', mr: 2 }}>
                        <SearchWidgetButton
                            title='Replace (Enter)'
                            onClick={(event) => {
                                event.preventDefault();
                                replaceNext(view);
                            }}
                            icon='codicon-replace'
                        />
                        <SearchWidgetButton
                            title='Replace All (Ctrl+Alt+Enter)'
                            onClick={(event) => {
                                event.preventDefault();
                                replaceAll(view);
                            }}
                            icon='codicon-replace-all'
                        />
                        <SearchWidgetButton
                            title='Select All'
                            onClick={(event) => {
                                event.preventDefault();
                                selectMatches(view);
                            }}
                            icon='codicon-checklist'
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export const SearchWidgetConstructor = (
    view: EditorView,
    editorViewRef: React.RefObject<EditorView | null>
): Panel => {
    const dom = document.createElement('div');
    const root = createRoot(dom);

    const closeSearchWidget = () => {
        if (editorViewRef.current) {
            closeSearchPanel(editorViewRef.current);
        }
    };
    root.render(
        <SettingsProvider>
            <ColorProvider>
                <SearchWidget view={view} onClose={closeSearchWidget} />
            </ColorProvider>
        </SettingsProvider>
    );

    return { dom, top: true };
};