import dayjs from 'dayjs';
import { Trash2Icon } from 'lucide-react';
import React, { useMemo } from 'react';
import { Button } from '../ui/button';
import NoteForm from './NoteForm';
import { useNotes } from './NotesProvider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

function NoteList() {
    const { notes, loading, addNote, deleteNote, creating } = useNotes()

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
            {sortedNotes.map(note => (
                <div key={note.id} className='py-2 border-b flex'>
                    <div className='flex-1'>
                        <div className='text-sm text-gray-500'>{dayjs(note.created_at).format('YYYY-MM-DD h:mm a')}</div>
                        <div className='text-md' dangerouslySetInnerHTML={{ __html: note.description.split('---')[0].trim() }}></div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2Icon className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this note.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteNote(note)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>)
            )}

        </div>
    )
}

export default NoteList