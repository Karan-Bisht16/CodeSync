import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    ListSubheader,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
// importing types
import type { SelectChangeEvent } from '@mui/material';

type CustomSelectProps = {
    id: string,
    name: string,
    value: string,
    onChange(event: SelectChangeEvent): void,
    list: { value: string, label: string }[],
    label?: string,
    maxHeight?: string | number,
    disabled?: boolean,
};

export const CustomSelect: React.FC<CustomSelectProps> = (props) => {
    const { id, name, value, onChange, list, label, maxHeight = 300, disabled = false } = props;

    const [searchQuery, setSearchQuery] = useState('');
    const filteredList = list.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isValueInFilteredList = filteredList.some(item => item.value === value);

    return (
        <FormControl fullWidth size='small'>
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                id={`${id}-select`}
                labelId={`${id}-select-label`}
                name={name}
                value={value}
                label={label}
                sx={{ color: 'text.primary' }}
                onChange={onChange}
                MenuProps={{
                    PaperProps: {
                        style: { maxHeight: maxHeight },
                    },
                    disablePortal: true,
                    MenuListProps: { autoFocusItem: false },
                }}
                disabled={disabled}
            >
                <ListSubheader sx={{ bgcolor: 'inherit' }}>
                    <TextField
                        fullWidth
                        size='small'
                        autoFocus={true}
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        sx={{ bgcolor: 'action.hover' }}
                    />
                </ListSubheader>

                {!isValueInFilteredList && (
                    <MenuItem value={value} style={{ display: 'none' }}>
                        {value}
                    </MenuItem>
                )}

                {filteredList.map(({ value, label }, index) => (
                    <MenuItem key={index} value={value}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};