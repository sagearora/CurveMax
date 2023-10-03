import React from 'react'
import { useRootContext } from '../../lib/RootContextProvider'
import Message from './Message'
import { useGetConversation } from './useGetConversation'
import { useMessaging } from './MessageProvider'
import MessageForm from './MessageForm'

function MessageHistory({
    phone
}: {
    phone: string
}) {
    const { conversation, loading, creating, sendMessage } = useMessaging()
    return (
        <div className='py-4'>
            {!loading && conversation.length === 0 && <div
                className='text-sm text-gray-500 text-center py-4'>
                No messages
            </div>}
            <div className='flex flex-col space-y-2'>
                <MessageForm
                    loading={creating}
                    submit={sendMessage}
                />
                {conversation.map((message) => <Message
                    item={message} key={message.id}
                />)}
            </div>
        </div>
    )
}

export default MessageHistory