import React, { useMemo } from 'react'
import { ConversationEntry } from '../../backend/gro_types'
import dayjs from 'dayjs'
import { cn } from '../../lib/utils'

function Message({
    item,
}: {
    item: ConversationEntry
}) {
    const time = useMemo(() => {
        if (dayjs().isSame(item.createdAt, 'day')) {
            return dayjs(item.createdAt).format('h:mm A')
        }
        return dayjs(item.createdAt).format('MMM D, h:mm A')
    }, [item.createdAt])
    return (
        <div key={item.id} className={cn(
            'bg-slate-100 p-4 rounded-md w-2/3',
            item.direction === 'Outgoing' ? 'self-end bg-blue-100' : 'self-start'
        )}>
            <div className='text-sm text-gray-700'>{time} &middot; {item.status}</div>
            {item.content}
        </div>
    )
}

export default Message