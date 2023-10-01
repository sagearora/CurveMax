import React, { useEffect, useState } from 'react'
import { RecareInfo as RecareInfoType } from '../../backend/types'
import { useRootContext } from '../../lib/RootContextProvider'
import { getRecareInfo } from '../../backend/calls'

function RecareInfo({
    patient_id,
}: {
    patient_id: string
}) {
    const { base_url } = useRootContext()
    const [loading, setLoading] = useState(false)
    const [recare_info, setRecareInfo] = useState<RecareInfoType[]>([])

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const recare = await getRecareInfo({
                    base_url,
                    patient_id
                })
                setRecareInfo(recare)
            } finally {
                setLoading(false)
            }
        })();
    }, [patient_id])

    return (
        <div>
            Recare Info
            <div>{recare_info.map(info => <div key={info.id}>
                {info.name} &middot; {info.frequency_months} m | {info.next || 'Not scheduled'} | Due: {info.due || 'Not Set'} | Last: {info.last || 'never'}
            </div>)}</div>
            
        </div>
    )
}

export default RecareInfo