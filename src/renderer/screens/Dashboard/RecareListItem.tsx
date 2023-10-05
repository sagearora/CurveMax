import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RecareReportRow, Todo } from '../../backend/types'
import { cn } from '../../lib/utils'
import RecareInfoItem from './RecareInfoItem'

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


function RecareListItem({
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
            {items.map(item => <RecareInfoItem key={item.id} item={item} />)}
            {/* <RecareInfo patient_id={patient_id} /> */}
            {/* <Notes patient_id={patient_id} hash={hash} /> */}
        </Link>
    )
}

export default RecareListItem