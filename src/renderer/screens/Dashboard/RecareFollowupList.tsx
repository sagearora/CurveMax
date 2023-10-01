import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { listCorrespondences } from '../../backend/calls'
import { Correspondence } from '../../backend/types'
import { useRootContext } from '../../lib/RootContextProvider'
import CorrespondenceItem, { CorrespondenceItemProps } from './CorrespondenceItem'


function RecareFollowupList() {
    const { base_url } = useRootContext()
    const [loading, setLoading] = useState(false)
    const [correspondences, setCorrespondences] = React.useState<Correspondence[]>([])
    const [dateRange, setDateRange] = useState({
        start: dayjs().subtract(5, 'd').toISOString(),
        end: dayjs().toISOString(),
    })

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const items = await listCorrespondences({
                    base_url,
                    activity: 'Recare Reminder Emailed,Recare Reminder Texted',
                    startDate: dateRange.start,
                    endDate: dateRange.end,
                })
                setCorrespondences(items)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        })();
    }, [dateRange, setCorrespondences, setLoading])

    const reduce_by_patients = useMemo(() => {
        return correspondences.reduce((acc, item) => {
            const patient_id = `${item.patient_id}`
            if (!acc[patient_id]) {
                acc[patient_id] = {
                    patient_id,
                    full_name: item.patient_full_name,
                    last_correspondence_date: new Date(item.log_date),
                    items: []
                }
            }
            if (new Date(item.log_date) > acc[patient_id].last_correspondence_date) {
                acc[patient_id].last_correspondence_date = new Date(item.log_date)
            }
            acc[patient_id].items.push(item)
            return acc
        }, {} as {[id: string]: CorrespondenceItemProps})
    }, [correspondences])

    const list = useMemo(() => {
        return Object.keys(reduce_by_patients).map((patient_id: string) => {
            const item = reduce_by_patients[patient_id]
            return {
                patient_id,
                full_name: item.full_name,
                last_correspondence_date: item.last_correspondence_date,
                items: item.items,
            }
        }).sort((a, b) => +b.last_correspondence_date - +a.last_correspondence_date)
    }, [reduce_by_patients])

    return (
        <div>
            <div>Recare Follow-up</div>
            {loading && <div>Loading...</div>}
            {list.map((patient) => (
                <CorrespondenceItem key={patient.patient_id} {...patient} />
            ))}
        </div>
    )
}

export default RecareFollowupList