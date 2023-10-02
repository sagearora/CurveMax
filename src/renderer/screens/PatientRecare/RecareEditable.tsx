import React from 'react'
import { RecareInfo } from '../../backend/types'
import { cn } from '../../lib/utils'

function RecareEditable({
    item,
}: {
    item: RecareInfo
}) {
    return (
        <div className={cn(
            'border-b py-2',
            !item.next && 'text-red-500',
        )}>
            <div>{item.name} &middot; {item.frequency_months} m</div>
            <div className='text-md'>
                Scheduled for: {item.next || 'Not Scheduled'}<br />
                Due: {item.due || 'Not Set'}<br />
                Last: {item.last || 'Never'}
            </div>
        </div>
    )
}

export default RecareEditable