import React, { ReactElement, useEffect, useState } from 'react'
import { createNote, getNotes, deleteNote as deleteNoteCurve, completeTodoOrMemo } from '../../backend/calls'
import { Note } from '../../backend/types'
import { useRootContext } from '../../lib/RootContextProvider'
import { createErrorToast } from '../../lib/createErrorToast'

export type NotesContextType = {
    notes: Note[]
    addNote: (text: string, due_date?: string) => Promise<boolean>
    loading?: boolean
    creating?: boolean
    deleteNote: (note_id: number) => Promise<boolean>
    completeNote: (note_id: number) => Promise<boolean>
}

const NotesContext = React.createContext<NotesContextType>({} as NotesContextType)

function NotesProvider({
    children,
    patient_id,
}: {
    children: ReactElement | ReactElement[]
    patient_id: string
}) {
    const { base_url, user: { name } } = useRootContext()
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
                description: `${description}<br/><div>- ${name}</div>`,
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

    const deleteNote = async (note_id: number) => {
        try {
            await deleteNoteCurve({
                base_url,
                note_id: note_id,
            })
            setNotes(n => n.filter(n => n.id !== note_id))
            return true
        } catch (e) {
            createErrorToast(e)
            return false
        }
    }

    const completeNote = async (note_id: number) => {
        try {
            const result = await completeTodoOrMemo({
                base_url,
                note_id,
            })
            setNotes(n => n.map(n => {
                if (n.id === note_id) {
                    return result.item
                }
                return n
            }))
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
            completeNote,
            loading,
            creating,
        }}>
            {children}
        </NotesContext.Provider>
    )
}

export const useNotes = () => React.useContext(NotesContext)

export default NotesProvider