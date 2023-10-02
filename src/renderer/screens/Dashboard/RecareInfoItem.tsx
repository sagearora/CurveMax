import React, { useMemo } from 'react'
import { RecareInfo, RecareReportRow } from '../../backend/types'
import { cn } from '../../lib/utils'

function RecareInfoItem({
    item,
}: {
    item: RecareReportRow
}) {

    return (
        <div className={cn(
            !item['Next Appt Date'] && 'text-red-500',
        )}>
            <div>{item['Recare Type']} &middot; {item['Recare Freq. Months']} m | <span className='font-bold'>
                {item['Recare Status']}</span>
            </div>
            <div className='text-gray-700 text-md'>
                Recare Next: {item['Recare Next Visit Date'] || 'Not Scheduled'} | Next Appt: {item['Next Appt Date'] || 'None'}<br />
                Due: {item['Recare Due Date'] || 'Not Set'}<br />
                Last: {item['Last Appt. Date'] || 'Never'}
            </div>
        </div>
    )
}

export default RecareInfoItem