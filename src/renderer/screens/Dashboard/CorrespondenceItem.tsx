import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { useEffect } from 'react'
import { getAppointments, getRecareInfo } from '../../backend/calls'
import { AppointmentSummary, Correspondence } from '../../backend/types'
import { useRootContext } from '../../lib/RootContextProvider'
import RecareInfo from './RecareInfo'

dayjs.extend(relativeTime)

export type CorrespondenceItemProps = {
    patient_id: string
    full_name: string
    last_correspondence_date: Date
    items: Correspondence[]
}

function CorrespondenceItem({
    patient_id,
    last_correspondence_date,
    full_name,
    items,
}: CorrespondenceItemProps) {
    const { base_url } = useRootContext()
    const [loading, setLoading] = React.useState(false)
    // const [appts, setAppts] = React.useState<AppointmentSummary[]>([])

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             setLoading(true)
    //             const appts = await getAppointments({
    //                 base_url,
    //                 patient_id
    //             })
    //             const recare = await getRecareInfo({
    //                 base_url,
    //                 patient_id
    //             })
    //             setAppts(appts)
    //         } finally {
    //             setLoading(false)
    //         }
    //     })();
    // }, [patient_id])

    return (
        <div className='py-2 border-b'>
            <div className='text-lg font-bold'>{full_name} &middot; {dayjs(last_correspondence_date).fromNow()}</div>
            <RecareInfo patient_id={patient_id} />
            {/* {appts.slice(0, 2).map(appt => <div key={appt.id}>
                <div>{dayjs(appt.starttime_at).format('YYYY-MM-DD h:mm a')} &middot; {appt.length} minutes</div>
                <div>{appt.description}</div>
            </div>)} */}
        </div>
    )
}

export default CorrespondenceItem