import React, { ReactElement, useState } from 'react'
import { ConversationEntry } from '../../backend/gro_types'
import { useRootContext } from '../../lib/RootContextProvider'
import { createErrorToast } from '../../lib/createErrorToast'
import { useGetConversation } from './useGetConversation'
import { createConversationEntry } from '../../backend/gro_call'

export type MessagingContextType = {
    conversation: ConversationEntry[]
    sendMessage: (content: string) => Promise<boolean>
    loading?: boolean
    creating?: boolean
    phone: string
}

const NotesContext = React.createContext<MessagingContextType>({} as MessagingContextType)

function MessagingProvider({
    children,
    phone: _phone,
}: {
    children: ReactElement | ReactElement[]
    phone?: string
}) {
    const { base_gro_url } = useRootContext()
    const { conversation, addEntry, loading, phone } = useGetConversation(
        base_gro_url,
        _phone
    )
    const [creating, setCreating] = useState(false)

    const sendMessage = async (content: string) => {
        try {
            setCreating(true)
            const message = await createConversationEntry({
                base_gro_url,
                content,
                phone,
            })
            if (message) {
                addEntry(message)
            }
            return true
        } catch (e) {
            createErrorToast(e)
            return false
        } finally {
            setCreating(false)
        }
    }

    return (
        <NotesContext.Provider value={{
            conversation,
            sendMessage,
            loading,
            creating,
            phone,
        }}>
            {children}
        </NotesContext.Provider>
    )
}

export const useMessaging = () => React.useContext(NotesContext)

export default MessagingProvider