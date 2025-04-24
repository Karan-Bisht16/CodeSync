import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
// importing types
import type { Collaborator } from '../types';

type CollaboratorListProps = {
    collaborators: Collaborator[];
};

export const CollaboratorList: React.FC<CollaboratorListProps> = (props) => {
    const { collaborators } = props;

    return (
        <List className='max-h-80 overflow-y-auto m-0'>
            {collaborators.length > 0 ? (
                collaborators.map((collaborator) => (
                    <ListItem key={collaborator.id} sx={{ p: '4px', marginTop: '2px' }}>
                        <ListItemAvatar sx={{ height: '32px', width: '32px', pl: '12px' }}>
                            <Avatar
                                sx={{
                                    height: '32px',
                                    width: '32px',
                                    fontSize: '16px',
                                    color: 'white',
                                    bgcolor: collaborator.color
                                }}
                            >
                                {collaborator.userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography sx={{ color: 'text.primary' }}>
                                    {collaborator.userName}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))
            ) : (
                <Typography
                    sx={{
                        textAlign: 'center',
                        color: 'text.secondary',
                        padding: '1rem 0'
                    }}
                >
                    No collaborator found
                </Typography>
            )}
        </List>
    );
};