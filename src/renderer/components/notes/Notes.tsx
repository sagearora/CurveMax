import React, { useMemo } from 'react';
import NoteForm from './NoteForm';
import NoteItem from './NoteItem';
import { useNotes } from './NotesProvider';

function NoteList() {
    const {
        notes,
        loading,
        addNote,
        deleteNote,
        completeNote,
        creating
    } = useNotes()

    const sortedNotes = useMemo(() => notes
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)), [
        notes,
    ])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='space-y-2 py-4'>
            <NoteForm
                loading={creating}
                submit={addNote}
            />
            {sortedNotes.map(note => <NoteItem item={note}
                deleteNote={() => deleteNote(note.id)}
                completeNote={() => completeNote(note.id)}
            />)}

        </div>
    )
}

export default NoteList