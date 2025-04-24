import React, { useState } from 'react';
import { Button } from '@mui/material';
import { track, useEditor } from 'tldraw';
// importing icons
import {
    People as ShowCollaboratorsIcon
} from '@mui/icons-material';
// importing components
import { ToolTip } from '../../../components/ToolTip';
import { Collaborators } from './Collaborators';

export const CollaboratorsPanel = track(() => {
    const editor = useEditor();
    const collaborators = editor.getCollaborators();

    const [showCollaborators, setShowCollaborators] = useState(false);

    const { color, name } = editor.user.getUserPreferences();

    const toggleCollaborators = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowCollaborators((prev) => !prev);
    };

    return (
        <div
            onClick={(event) => event.stopPropagation()}
            className='flex items-center relative !z-[1000] m-2 pointer-events-auto'
        >
            <div className='flex items-center mr-4'>
                {name} (you)
                <div
                    style={{ backgroundColor: color }}
                    className='h-8 w-8 ml-2 rounded-full'
                />
            </div>

            <ToolTip title='Show collaborators'>
                <Button
                    variant='outlined'
                    size='small'
                    onClick={toggleCollaborators}
                    startIcon={<ShowCollaboratorsIcon />}
                >
                    {collaborators.length}
                </Button>
            </ToolTip>

            {showCollaborators && (
                <Collaborators
                    collaborators={collaborators}
                    onClose={() => setShowCollaborators(false)}
                />
            )}
        </div>
    );
});