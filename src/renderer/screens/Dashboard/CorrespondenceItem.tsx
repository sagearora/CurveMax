import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RecareReportRow, Todo } from '../../backend/types'
import { Button } from '../../components/ui/button'
import RecareInfoItem from './RecareInfoItem'
import { cn } from '../../lib/utils'

dayjs.extend(relativeTime)

export type CorrespondenceItemProps = {
    patient_id: string
    full_name: string
    recare_due_date: Date
    items: RecareReportRow[]
    todos?: Todo[]
}

function getHueBasedOnDueDate(dueDate: Date): string {
    const currentDate: Date = new Date();
    const msInADay: number = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    // Calculate the difference between the due date and the current date in days
    const dateDiff: number = (dueDate.getTime() - currentDate.getTime()) / msInADay;

    // Check the conditions and return corresponding color
    if (dateDiff >= 4) {
        return "bg-yellow-50 hover:bg-yellow-100"; // Far from the due date
    } else if (dateDiff >= 3) {
        return "bg-orange-100 hover:bg-orange-200"; // Slightly closer to the due date
    } else if (dateDiff >= 1) {
        return "bg-orange-200 hover:bg-orange-300"; // Very close to the due date
    } else if (dateDiff >= 0) {
        return "bg-red-100 hover:bg-red-200"; // Day of the due date
    } else {
        return "bg-red-200 hover:bg-red-300"; // Past the due date
    }
}


function CorrespondenceItem({
    patient_id,
    recare_due_date,
    full_name,
    items,
    todos,
}: CorrespondenceItemProps) {
    const [bgColor, setBgColor] = useState('bg-white')

    useEffect(() => {

        const filter = (note: Todo) => {
            return note.todo && (note.note_tags || []).findIndex(t => t.name === 'Recare') > -1
        }
        const recent_todo = (todos || [])
            .filter(filter)
            .sort((a, b) => +dayjs(a.created_at) - +dayjs(a.created_at))[0]
        if (recent_todo) {
            setBgColor(getHueBasedOnDueDate(new Date(recent_todo.todo?.due_date || '')))
        }
    }, [todos])

    return (
        <Link className={cn(
            'p-2 border-b space-y-2 hover:bg-slate-200 block',
            bgColor,
        )} to={`/${patient_id}`}>
            <div className='text-lg font-bold'>{full_name} &middot; {dayjs(recare_due_date).fromNow()}</div>
            <div className='flex space-x-2'>
                <Button size='sm' variant='outline'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                    </svg>
                    Call</Button>
                <Button size='sm' variant='outline'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
                    </svg>
                    Text
                </Button>
                <Button size='sm' variant='outline'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                    </svg>

                    Refresh
                </Button>
            </div>
            {items.map(item => <RecareInfoItem key={item.id} item={item} />)}
            {/* <RecareInfo patient_id={patient_id} /> */}
            {/* <Notes patient_id={patient_id} hash={hash} /> */}
        </Link>
    )
}

export default CorrespondenceItem