import React, { useEffect, useState } from 'react'
import { getRecareInfo } from '../../backend/calls'
import { RecareInfo as RecareInfoType } from '../../backend/types'
import { useRootContext } from '../../lib/RootContextProvider'
import RecareEditable from './RecareEditable'

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

    if (loading) {
        return <div className='space-y-2 animate-pulse'>
            <div className='bg-slate-200 w-24 h-2 rounded-md'></div>
            <div className='bg-slate-200 w-64 h-2 rounded-md'></div>
            <div className='bg-slate-200 w-64 h-2 rounded-md'></div>
        </div>
    }

    return (
        <div>
            <div>{recare_info.map(info => <RecareEditable key={info.id}
                item={info} />
            )}</div>
        </div>
    )
}

export default RecareInfo