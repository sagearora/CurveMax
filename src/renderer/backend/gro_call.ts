import { ConversationEntry } from './gro_types'

export const getConversationId = async ({
    base_gro_url,
    phone,
}: {
    base_gro_url: string,
    phone: string
}) => {
    try {
        const res = await fetch(`https://${base_gro_url}/api/conversation/search?number=${phone}`)
        if (res.status === 200) {
            const data = await res.json()
            return data[0]?.id
        }
        return null
    } catch (e) {
        return null
    }
}

export const getConversationHistory = async ({
    base_gro_url,
    conversation_id,
}: {
    base_gro_url: string
    conversation_id: string
}) => {
    try {
        const res = await fetch(`https://${base_gro_url}/api/conversation/${conversation_id}/history`)
        if (res.status === 200) {
            const data = await res.json()
            return (data?.objects || []) as ConversationEntry[]
        }
        return []
    } catch(e) {
        console.error(e)
        return []
    }
}

export const createConversationEntry = async ({
    base_gro_url,
    phone,
    content,
}: {
    base_gro_url: string
    phone: string,
    content: string
}) => {
    //https://aroradental.curvegro.com/api/conversation_entry
    const res = await fetch(`https://${base_gro_url}/api/conversation_entry`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "externalCorrespondent": phone,
            "content": content,
        })
    })
    const data = await res.json() as ConversationEntry
    return data
}