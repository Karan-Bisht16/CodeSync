import React from 'react';
import { Box, Switch, Typography } from '@mui/material';
// importing contexts
import { useSettingsContext } from '../contexts/Settings.context';

type SettingsCheckBoxProps = {
    label: string,
    name: string,
    description?: string,
    disabled?: boolean,
};

export const SettingsCheckBox: React.FC<SettingsCheckBoxProps> = (props) => {
    const { label, name, description, disabled = false } = props;

    const { settings, updateCheckboxSettings } = useSettingsContext();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
            <Box>
                <Typography>{label}</Typography>
                <Typography variant='subtitle1' color='text.secondary' fontSize='small'>{description}</Typography>
            </Box>
            <Switch
                name={name}
                disabled={disabled}
                checked={settings[name as keyof typeof settings] as boolean}
                onChange={updateCheckboxSettings}
            />
        </Box>
    );
};