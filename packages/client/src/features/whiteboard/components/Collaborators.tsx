import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
// importing types
import type { Collaborator } from '../types';
// importing hooks
import { useDrag } from '../hooks/useDrag';
// importing components
import { CollaboratorHeader } from './CollaboratorHeader';
import { CollaboratorList } from './CollaboratorList';
import { CollaboratorSearch } from './CollaboratorSearch';

type CollaboratorsProps = {
    collaborators: Collaborator[];
    onClose(): void;
};

export const Collaborators: React.FC<CollaboratorsProps> = (props) => {
    const { collaborators, onClose } = props;
    
    const { position, isDragging, handleMouseDown } = useDrag();

    const collaboratorsPanelRef = useRef<HTMLDivElement>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCollaborators, setFilteredCollaborators] = useState<Collaborator[]>(collaborators);


    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredCollaborators(collaborators);
        } else {
            const filtered = collaborators.filter((collaborator) =>
                collaborator.userName.toLowerCase().includes(searchTerm.toLowerCase()),
            );
            setFilteredCollaborators(filtered);
        }
    }, [searchTerm, collaborators]);

    return (
        <Box
            ref={collaboratorsPanelRef}
            className='!shadow-lg'
            sx={{
                overflow: 'hidden',
                width: '320px',
                position: 'fixed',
                top: `${position.y}px`,
                left: `${position.x}px`,
                zIndex: 200,
                color: 'text.primary',
                bgcolor: 'background.paper',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: 'background.default',
            }}
            onMouseDown={(e) => collaboratorsPanelRef.current && handleMouseDown(e, collaboratorsPanelRef.current)}
        >
            <CollaboratorHeader
                collaboratorCount={collaborators.length}
                onClose={onClose}
                isDragging={isDragging}
            />
            <CollaboratorSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <CollaboratorList collaborators={filteredCollaborators} />
        </Box>
    );
};