import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Link as NavigateLink, useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
} from '@mui/material';
// importing icons
import {
    ContentCopyOutlined as CopyRoomIDIcon,
    Info,
    PlayArrow as RunCodeIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
// importing data
import { constantsJSON } from '../data/constants.data';
// importing features
import { useAuthContext } from '../features/auth';
import { DynamicPanel } from '../features/dynamicPanel';
import {
    ActivityDock,
    EditorComponent,
    EditorOutputStatus,
    FloatingControls,
    HostControls,
    useEditorContext
} from '../features/editor';
import { EngagementPanel } from '../features/engagementPanel';
import {
    CodeExecutionNotification,
    CodeExecutionState,
    JoinRequestNotifications,
    RaisedHandNotification
} from '../features/notifications';
import { EntryForm, useRoomContext } from '../features/room';
import { useSettingsContext } from '../features/settings';
import { TerminalPanel } from '../features/terminalPanel';
import { useUserContext } from '../features/user';
// importing contexts
import { useColorContext } from '../contexts/Color.context';
import { useMobileContext } from '../contexts/Mobile.context';
import { useModalContext } from '../contexts/Modal.context';
import { usePanelContext } from '../contexts/Panel.context';
import { useSnackBarContext } from '../contexts/SnackBar.context';
import { useSocketContext } from '../contexts/Socket.context';
// importing layout components
import { NavActions } from '../layouts/NavActions';
// importing components
import { BackDrop } from '../components/BackDrop';
import { CustomSelect } from '../components/CustomSelect';
import { LoadingModal } from '../components/LoadingModal';
import { Logo } from '../components/Logo';
import { ToolTip } from '../components/ToolTip';
// importing utils
import { EditorLanguage, editorLanguages, hasPermission } from '@codesync/shared';
import { linkTo } from '../utils/helpers.util';
import { LanguageInfoModal } from '../features/editor/components/LanguageInfo';

export const Editor: React.FC = () => {
    const { activityDockWidth, dynamicPanelWidth, navbarHeight, terminalPanelHeight } = constantsJSON;

    const { openAuthModal } = useAuthContext();
    const { palette, theme } = useColorContext();
    const { editor, handleEditorLanguageChange, handleEditorOutputChange } = useEditorContext();
    const { isMobile } = useMobileContext();
    const { openModal } = useModalContext();
    const {
        dynamicPanel,
        handleActiveTerminalTabChange,
        terminalPanel,
        openTerminalPanel,
        hostControlsModal,
        closeHostControlsModal
    } = usePanelContext();
    const { room, isRoomInitialized, isValidRoom } = useRoomContext();
    const { openSnackBar } = useSnackBarContext();
    const { settings } = useSettingsContext();
    const {
        socket,
        hasJoined,
        initializeSession,
        sendMessage,
        getExecutedCode
    } = useSocketContext();
    const { user, isLoggedIn, isValidUser, userFetchedFromLocalStorage } = useUserContext();

    const { roomID } = useParams<string>();

    const navigate = useNavigate();

    // TODO: maybe a modal with '{this} user opened whiteboard do you want to follow?'
    // when no one on whiteboard page then notify in chat that 'no one in whiteboard'?
    const openWhiteboard = () => {
        const link = `${window.location.origin}/whiteboard/${roomID}`;
        sendMessage({
            message: `${user.username} opened whiteboard`,
            isAnnouncement: true,
            countsAsUnread: false,
        })
        linkTo(link);
    };

    const copyRoomID = () => {
        if (roomID) {
            navigator.clipboard.writeText(roomID);
            openSnackBar({
                status: 'success',
                message: 'Room ID copied to clipboard'
            });
        }
    };

    const saveRoom = () => {
        if (!isLoggedIn) {
            openAuthModal('login');
        }
    };

    const [runningCode, setRunningCode] = useState<boolean>(false);
    const [codeExecutionState, setCodeExecutionState] = useState<CodeExecutionState>({
        status: 'waiting',
        message: '',
    });
    const [showCodeExecutionNotification, setShowCodeExecutionNotification] = useState<boolean>(false);
    const runCode = async () => {
        setRunningCode(true);
        handleEditorOutputChange({ output: '', status: null });
        setShowCodeExecutionNotification(true);
        setCodeExecutionState({
            status: 'waiting',
            message: 'Code execution in progress...',
        });

        const response = await getExecutedCode();
        let outputMessage = 'No response received. Please check your code or try again';
        let outputStatus: EditorOutputStatus = 'error';
        if (response) {
            const { code, data: { result, error }, message } = response;

            if (code === 200 && !error) {
                outputMessage = result;
                outputStatus = 'success';
                setCodeExecutionState({
                    status: outputStatus,
                    message: message || 'Code executed successfully',
                });
            } else if (code === 200 && error) {
                outputMessage = result;
                setCodeExecutionState({
                    status: outputStatus,
                    message: message || 'An error occurred during code execution',
                });
            } else if (code === 504) {
                outputMessage = message || 'Code execution timed out. Please check your code';
                setCodeExecutionState({
                    status: outputStatus,
                    message: outputMessage,
                });
            } else {
                outputMessage = message || 'Unexpected error. Please check your code';
                setCodeExecutionState({
                    status: outputStatus,
                    message: outputMessage,
                });
            }
        } else {
            setCodeExecutionState({
                status: outputStatus,
                message: outputMessage,
            });
        }
        handleEditorOutputChange({ output: outputMessage, status: outputStatus });
        if (terminalPanel) { handleActiveTerminalTabChange(null, 1) }
        else { openTerminalPanel(1) }
        setRunningCode(false);
    };

    const [languageInfoModal, setLangugaeModal] = useState<EditorLanguage | false>(false);

    const openLangugageModal = (language: EditorLanguage) => {
        setLangugaeModal((prevLanguage) => {
            if (_.isEqual(language, prevLanguage)) {
                return false;
            }
            return language;
        });
    };

    const closeLangugageModal = () => {
        setLangugaeModal(false);
    };

    useEffect(() => {
        if (!isValidUser(user) || !roomID || !socket?.connected || hasJoined) return;

        initializeSession(roomID);
    }, [user.userID, user.username, roomID, socket?.connected]);

    useEffect(() => {
        if (isRoomInitialized && room.joinPolicy === 'locked') {
            openModal({
                isPersistent: true,
                modalContent: {
                    title: 'Room Locked',
                    content: 'This room is currently locked and cannot be joined. If you believe this is a mistake, please contact the host to request access.'
                },
                modalButtons: [{
                    label: 'Leave',
                    autoFocus: true,
                    variant: 'contained',
                    color: 'primary',
                    onClickFunction: () => navigate('/room'),
                }]
            });
        }
    }, [roomID, isRoomInitialized]);

    const canAccessHostControls = useMemo(() => {
        if (isValidRoom(room)) {
            return hasPermission(user, 'rooms', 'host-controls', room);
        }
    }, [user, room]);

    if (!roomID) { return <Navigate to='/room' /> }

    if (!userFetchedFromLocalStorage) {
        return (
            <BackDrop>
                <EntryForm fetchedRoomID={roomID} />
            </BackDrop>
        );
    }

    if (!isRoomInitialized) {
        return <LoadingModal text='Initializing room...' />
    }

    if (!hasPermission(user, 'rooms', 'join', room)) {
        return <LoadingModal
            text={`<p class='text-[36px]'>Asking to be let in...</p><br />You'll join the call when someone lets you in`}
        />
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', color: 'text.primary', bgcolor: 'background.default' }}>
            <AppBar
                position='relative'
                elevation={0}
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    zIndex: (theme) => theme.zIndex.appBar,
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: navbarHeight }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NavigateLink to='/'>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Logo
                                    color={palette[theme]?.text?.primary}
                                    style='pb-1'
                                    hideTitle
                                />
                            </Box>
                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Logo
                                    color={palette[theme]?.text?.primary}
                                    style='pb-1 relative -left-1'
                                    size='32'
                                    hideTitle
                                />
                            </Box>
                        </NavigateLink>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, ml: { xs: 1, md: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ToolTip title='Language'>
                                    <CustomSelect
                                        id='language'
                                        name='editorLanguage'
                                        value={editor.language.value}
                                        onChange={handleEditorLanguageChange}
                                        list={editorLanguages}
                                        label={editor.language.version}
                                        disabled={!hasPermission(user, 'rooms', 'edit', room)}
                                    />
                                </ToolTip>
                                <Box sx={{ position: 'relative' }}>
                                    <ToolTip title='Language Info'>
                                        <IconButton size='small' onClick={() => openLangugageModal(editor.language)}>
                                            <Info fontSize='small' />
                                        </IconButton>
                                    </ToolTip>
                                    <LanguageInfoModal open={languageInfoModal} onClose={closeLangugageModal} />
                                </Box>
                            </Box>
                            {!isMobile &&
                                <ToolTip title='Copy Room ID'>
                                    <Button
                                        size='small'
                                        variant='outlined'
                                        onClick={copyRoomID}
                                        startIcon={<CopyRoomIDIcon fontSize='small' />}
                                        sx={{ textTransform: 'none', borderRadius: 2 }}
                                    >
                                        Copy Room ID
                                    </Button>
                                </ToolTip>
                            }
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ToolTip title='Run Code (Ctrl + Enter)'>
                            <Button
                                size='small'
                                variant='contained'
                                color='primary'
                                startIcon={<RunCodeIcon />}
                                disabled={runningCode}
                                onClick={runCode}
                                sx={{ borderRadius: 2 }}
                            >
                                Run
                            </Button>
                        </ToolTip>

                        {!isMobile &&
                            <ToolTip title='Save Room (Ctrl + S)'>
                                <IconButton size='small' color='inherit' onClick={saveRoom}>
                                    <SaveIcon fontSize='small' />
                                </IconButton>
                            </ToolTip>
                        }
                        <NavActions />
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <ActivityDock openWhiteboard={openWhiteboard} />
                <DynamicPanel />

                <Box
                    component='main'
                    sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', position: 'relative' }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflow: 'hidden',
                            height: `calc(100vh - ${navbarHeight} - ${terminalPanel ? terminalPanelHeight : '0px'})`,
                            width: `calc(100vw - ${activityDockWidth} - ${dynamicPanel ? dynamicPanelWidth : '0px'})`,
                            bgcolor: 'background.default',
                        }}
                    >
                        <EditorComponent roomID={roomID} />
                    </Box>
                    <TerminalPanel />
                </Box>
                <EngagementPanel />
            </Box>
            <FloatingControls />

            <JoinRequestNotifications />
            {settings.notifyHandRaised && <RaisedHandNotification />}
            {
                showCodeExecutionNotification &&
                <CodeExecutionNotification
                    state={codeExecutionState}
                    show={showCodeExecutionNotification}
                    onClose={() => {
                        setShowCodeExecutionNotification(false);
                        setRunningCode(false);
                    }}
                />
            }
            {
                canAccessHostControls && (
                    <HostControls open={hostControlsModal} onClose={closeHostControlsModal} />
                )
            }
        </Box >
    );
};