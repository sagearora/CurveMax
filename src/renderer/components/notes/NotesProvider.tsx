import React, { ReactElement, useEffect, useState } from 'react'
import { createNote, getNotes, deleteNote as  deleteNoteCurve } from '../../backend/calls'
import { Note } from '../../backend/types'
import { useRootContext } from '../../lib/RootContextProvider'
import { createErrorToast } from '../../lib/createErrorToast'

export type NotesContextType = {
    notes: Note[]
    addNote: (text: string, due_date?: string) => Promise<boolean>
    loading?: boolean
    creating?: boolean
    deleteNote: (note: Note) => Promise<boolean>
}

const NotesContext = React.createContext<NotesContextType>({} as NotesContextType)

function NotesProvider({
    children,
    patient_id,
}: {
    children: ReactElement | ReactElement[]
    patient_id: string
}) {
    const { base_url, user_name } = useRootContext()
    const [loading, setLoading] = useState(false)
    const [notes, setNotes] = useState<Note[]>([])
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const notes = await getNotes({
                    base_url,
                    patient_id
                })
                setNotes(notes)
            } finally {
                setLoading(false)
            }
        })();
    }, [patient_id])

    const addNote = async (description: string, due_date?: string) => {
        try {
            setCreating(true)
            const note = await createNote({
                base_url,
                patient_id,
                description: `${description}<br/><div>- ${user_name}</div>`,
                due_date,
            })
            if (note.item) {
                setNotes(n => [...n, note.item])
            }
            return true
        } catch (e) {
            createErrorToast(e)
            return false
        } finally {
            setCreating(false)
        }
    }

    const deleteNote = async(note: Note) => {
        try {
            await deleteNoteCurve({
                base_url,
                note_id: note.id,
            })
            setNotes(n => n.filter(n => n.id !== note.id))
            return true
        } catch (e) {
            createErrorToast(e)
            return false
        }
    }

    return (
        <NotesContext.Provider value={{
            notes,
            addNote,
            deleteNote,
            loading,
            creating,
        }}>
            {children}
        </NotesContext.Provider>
    )
}

export const useNotes = () => React.useContext(NotesContext)

export default NotesProvider