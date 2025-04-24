import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
// importing icons
import {
    Search as SearchIcon,
} from '@mui/icons-material';

type CollaboratorSearchProps = {
    searchTerm: string;
    onSearchChange: (term: string) => void;
};

export const CollaboratorSearch: React.FC<CollaboratorSearchProps> = (props) => {
    const { searchTerm, onSearchChange } = props;

    return (
        <Box sx={{ p: '0.75rem', pt: '0.05rem' }}>
            <TextField
                fullWidth
                variant='outlined'
                placeholder='Search'
                size='small'
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                sx={{ bgcolor: 'background.default' }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <SearchIcon fontSize='small' sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};