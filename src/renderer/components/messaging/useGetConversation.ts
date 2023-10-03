import { useCallback, useEffect, useMemo, useState } from "react"
import { getConversationHistory, getConversationId } from "../../backend/gro_call"
import { createErrorToast } from "../../lib/createErrorToast"
import { ConversationEntry } from "../../backend/gro_types"

export const useGetConversation = (
    base_gro_url: string,
    _phone?: string
) => {
    const [conversation, setConversation] = useState<ConversationEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [conversation_id, setConversationId] = useState()
    const phone = useMemo(() => {
        if (!_phone) {
            return ''
        }
        return _phone.startsWith('1') ? _phone : `1${_phone}`
    }, [_phone])

    useEffect(() => {
        if (!phone) {
            return
        }
        (async () => {
            setConversationId(await getConversationId({
                base_gro_url,
                phone: phone.startsWith('1') ? phone : `1${phone}`,
            }))
        })();
    }, [base_gro_url, phone])

    const refresh = useCallback(async () => {
        if (!conversation_id) {
            return
        }
        try {
            setLoading(true)
            const conversation = await getConversationHistory({
                base_gro_url,
                conversation_id,
            })
            setConversation(conversation)
        } catch (e) {
            createErrorToast(e)
        } finally {
            setLoading(false)
        }
    }, [base_gro_url, conversation_id])

    const addEntry = (entry: ConversationEntry) => {
        setConversation([
            entry,
            ...conversation,
        ])
    }

    useEffect(() => {
        refresh()
    }, [conversation_id])
    
    return {
        conversation_id,
        conversation,
        loading,
        phone,
        addEntry,
    }
}