import React, { useState } from 'react';
import { Box, Typography, Chip, Stack, IconButton } from '@mui/material';
// importing icons
import {
    Check as CodeCopiedIcon,
    Close as CloseIcon,
    ContentCopy as CopyCodeIcon,
    Navigation as PointUpIcon,
    Verified as VerifiedIcon
} from '@mui/icons-material';
// importing types
import type { EditorLanguage } from '@codesync/shared';
// impoting contexts
import { useSnackBarContext } from '../../../contexts/SnackBar.context';
// impoting components
import { ToolTip } from '../../../components/ToolTip';

type LanguageInfoModalProps = {
    open: EditorLanguage | false;
    onClose(): void,
};

export const LanguageInfoModal: React.FC<LanguageInfoModalProps> = (props) => {
    const { open, onClose } = props;

    if (!open) {
        return null;
    }

    const { label, version, extension, boilerPlateCode, prettierSupport } = open;

    const { openSnackBar } = useSnackBarContext();

    const [copied, setCopied] = useState(false)

    const handleCopyCode = () => {
        navigator.clipboard.writeText(boilerPlateCode);
        setCopied(true);
        openSnackBar({ status: 'success', message: 'Code copied successfully' });

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'absolute',
                top: '85%',
                left: '50%',
                transform: 'translateX(-50%)',
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <PointUpIcon
                    fontSize='large'
                    sx={{ position: 'absolute', transform: 'translateX(-50%)', color: 'white' }}
                />
                <PointUpIcon
                    fontSize='large'
                    sx={{ position: 'absolute', transform: 'translateX(-50%)', color: 'background.default', opacity: 0.95 }}
                />
            </Box>
            <Box
                sx={{
                    width: '360px',
                    position: 'absolute',
                    top: '22.5px',
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 4
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        bgcolor: 'background.default',
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: 4,
                        opacity: 0.95
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            mb: 1.5
                        }}
                    >
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Typography variant='h6' fontWeight={600}>
                                {label}
                            </Typography>
                            <Chip label={version} size='small' color='primary' variant='outlined' />
                            {prettierSupport &&
                                <ToolTip title='Prettier formatting support available'>
                                    <Chip label='Prettier' size='small' color='success' icon={<VerifiedIcon fontSize='small' />} />
                                </ToolTip>
                            }
                        </Stack>
                        <IconButton aria-label='close' color='inherit' size='small' onClick={onClose}>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    </Box>

                    <Stack spacing={1}>
                        <Typography variant='body2' color='text.secondary'>
                            <strong>Extension:</strong> {extension}
                        </Typography>
                        <Box
                            sx={{
                                maxHeight: '360px',
                                width: '100%',
                                position: 'relative',
                                color: 'text.secondary',
                                bgcolor: 'background.paper',
                                p: 1.5,
                                borderRadius: 2
                            }}
                        >
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <ToolTip title={copied ? 'Copied!' : 'Copy code'}>
                                    <IconButton
                                        size='small'
                                        onClick={handleCopyCode}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        {copied
                                            ? <CodeCopiedIcon fontSize='small' />
                                            : <CopyCodeIcon fontSize='small' />}
                                    </IconButton>
                                </ToolTip>
                            </Box>
                            <pre style={{
                                background: 'inherit',
                                color: 'inherit',
                                fontFamily: `Consolas, 'Courier New', monospace`,
                                fontSize: '14px',
                                overflowX: 'auto'
                            }}>
                                <code>
                                    {boilerPlateCode}
                                </code>
                            </pre>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};