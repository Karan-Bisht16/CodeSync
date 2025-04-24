import React from 'react';
import { Box, Slider, Stack } from '@mui/material';
// importing icons
import {
    VolumeUp as VolumeUpIcon,
} from '@mui/icons-material';
// importing features
import { useNotificationSound } from '../../notifications';
import { useUserContext } from '../../user';
// importing contexts
import { useSettingsContext } from '../contexts/Settings.context';
// importing components
import { SectionHeading } from './SectionHeading';
import { SectionSubHeading } from './SectionSubHeading';
import { SettingsCheckBox } from './SettingsCheckBox';

export const NotificationSettings: React.FC = () => {
    const { user } = useUserContext();
    const { settings, updateSliderSettings } = useSettingsContext();

    const playNotification = useNotificationSound();

    return (
        <Stack spacing={3}>
            <SectionHeading text='Notifications' />
            <Stack spacing={1}>
                <SettingsCheckBox
                    label='Hand Raised'
                    name='notifyHandRaised'
                    description='Show a notification when someone raises their hand'
                />
            </Stack>

            <Box>
                <SectionSubHeading text='Sound' />
                <Stack spacing={1}>
                    <SettingsCheckBox
                        label='All Notification Sounds'
                        name='notificationAudioEnabled'
                        description='Enable all notification sounds; unchecking disables sounds and options below.'
                    />
                    <SettingsCheckBox
                        label='Hand Raised'
                        name='notificationAudioHandRaised'
                        description='Play notification when someone raises their hand.'
                        disabled={!settings.notificationAudioEnabled}
                    />
                    <SettingsCheckBox
                        label='Chat Messages'
                        name='notificationAudioChatMessages'
                        description='Play notification when a new chat message arrives.'
                        disabled={!settings.notificationAudioEnabled}
                    />
                    <SettingsCheckBox
                        label='Code Execution'
                        name='notificationAudioCodeExecutionFinised'
                        description='Play notification when a code execution is successful.'
                        disabled={!settings.notificationAudioEnabled}
                    />
                    {user.roles?.includes('host') &&
                        <SettingsCheckBox
                            label='Join Request'
                            name='notificationAudioJoinRequest'
                            description='Play notification when a someone wants to join the call.'
                            disabled={!settings.notificationAudioEnabled}
                        />
                    }
                </Stack>
            </Box>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionSubHeading text={`Volume: ${settings.notificationVolume}`} />
                    <VolumeUpIcon onClick={playNotification} sx={{ mb: 1, mr: 2 }} />
                </Box>
                <Slider
                    step={5}
                    min={0}
                    max={100}
                    marks
                    size='small'
                    disabled={!settings.notificationAudioEnabled}
                    valueLabelDisplay='auto'
                    name='notificationVolume'
                    value={settings.notificationVolume}
                    onChange={updateSliderSettings}
                />
            </Box>
        </Stack>
    );
};