import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { Md5 } from 'ts-md5'
import { checkIsReportDone, downloadReport, queryReport } from '../../backend/calls'
import { RecareReportRow } from '../../backend/types'
import { useRootContext } from '../../lib/RootContextProvider'
import { CorrespondenceItemProps } from './CorrespondenceItem'
import RecareFilters from './RecareFilters'
import RecareList from './RecareList'
import { useTodos } from '../../components/todos/TodosProvider'

const Max_Attempts = 50; // Set max attempts
const Poll_Interval = 3000; // Set poll interval to 3 seconds
const Cache_Interval = 5 * 60 * 60 * 1000 // 5 seconds

function RecareReport() {
    const { base_url, recare_report_id } = useRootContext()
    const { refresh: refreshTodos } = useTodos()
    const [loading, setLoading] = useState<string | false>(false)
    const [correspondences, setCorrespondences] = React.useState<RecareReportRow[]>([])
    const [fetched_at, setFetchedAt] = useState<number | null>(null)
    const [is_max_attempts_reached, setIsMaxAttemptsReached] = useState(false)
    const [force_reload, setForceReload] = useState<number | false>(false)
    const [report_id, setReportId] = useState<string | null>(null)
    const [filters, setFilters] = useState<any[]>([])

    useEffect(() => {
        if (filters.length === 0) {
            return
        }
        (async () => {
            try {
                setLoading('querying report')
                setCorrespondences([])
                setReportId(null)
                const cache_id = `query_${recare_report_id}_${Md5.hashStr(JSON.stringify(filters))}`
                console.log(cache_id)
                // try to load from cache
                if (!force_reload) {
                    const cached = await window.electron.ipcRenderer.invoke('get_from_cache', cache_id)
                    if (typeof cached === 'string') {
                        const cached_data = JSON.parse(cached) as {
                            report_id: string
                            fetched_at: number
                        }
                        if ((cached_data.fetched_at + Cache_Interval) > +new Date()) {
                            console.log('found in cache', cached_data.report_id)
                            setReportId(cached_data.report_id)
                            return
                        }
                        console.log('cache report invalid, delete old data', cached_data.report_id)
                        await window.electron.ipcRenderer.invoke('delete_from_cache', `report_${cached_data.report_id}`)
                    }
                }
                const report_id = await queryReport({
                    base_url,
                    report_template_id: recare_report_id,
                    filters,
                })
                console.log('saving to cache', cache_id)
                window.electron.ipcRenderer.invoke('set_in_cache', cache_id, JSON.stringify({
                    report_id,
                    fetched_at: +new Date(),
                }))
                setReportId(report_id)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        })()
    }, [filters, recare_report_id, base_url, force_reload, setLoading])

    useEffect(() => {
        if (!report_id) {
            return
        }
        setLoading('check report status...')
        let intervalId: NodeJS.Timeout;
        (async () => {
            const cached = await window.electron.ipcRenderer.invoke('get_from_cache', `report_${report_id}`)
            if (typeof cached === 'string') {
                const cached_data = JSON.parse(cached) as {
                    items: RecareReportRow[]
                    fetched_at: number
                }
                setCorrespondences(cached_data.items)
                setFetchedAt(cached_data.fetched_at)
                setLoading(false)
                return
            }
            let attempts = 0; // Initialize attempt count
            intervalId = setInterval(async () => {
                if (attempts < Max_Attempts) { // Check if attempt count is less than max allowed
                    const isSuccess = await checkIsReportDone({
                        base_url, report_id
                    }); // Call the async function

                    if (isSuccess) { // Check if the function returned true
                        clearInterval(intervalId); // If true, clear interval and stop attempts
                        setLoading('downloading report...')

                        const cached = window.electron.ipcRenderer.invoke('get_from_cache', `report_${report_id}`)
                        if (typeof cached === 'string') {
                            const cached_data = JSON.parse(cached) as {
                                items: RecareReportRow[]
                                fetched_at: number
                            }
                            setCorrespondences(cached_data.items)
                            setFetchedAt(cached_data.fetched_at)
                            setLoading(false)
                            return
                        }

                        // fetch the data
                        const result = await downloadReport<RecareReportRow>({
                            base_url,
                            report_id,
                        })
                        const fetched_at = +new Date()
                        window.electron.ipcRenderer.invoke('set_in_cache', `report_${report_id}`, JSON.stringify({
                            items: result?.items || [],
                            fetched_at,
                        }))
                        setCorrespondences(result?.items || [])
                        setFetchedAt(fetched_at)
                        setLoading(false)
                    } else {
                        attempts++; // If false, increment attempt count and try again
                    }
                } else {
                    clearInterval(intervalId); // If max attempts reached, clear interval and stop attempts
                    setIsMaxAttemptsReached(true)
                    setLoading('max attempts reached')
                }
            }, Poll_Interval); // Call function every 3 seconds
        })();
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [report_id, base_url])

    const reload = () => {
        setForceReload(+new Date())
        refreshTodos()
    }

    const reduce_by_patients = useMemo(() => {
        return correspondences.reduce((acc, item) => {
            const patient_id = `${item['Patient Contact ID']}`
            if (!acc[patient_id]) {
                acc[patient_id] = {
                    patient_id,
                    recare_due_date: new Date(item['Recare Due Date']),
                    full_name: item['Full Name'],
                    items: []
                }
            }
            acc[patient_id].items.push(item)
            acc[patient_id].recare_due_date = new Date(item['Recare Due Date']) < acc[patient_id].recare_due_date
                ? new Date(item['Recare Due Date'])
                : acc[patient_id].recare_due_date
            return acc
        }, {} as { [id: string]: CorrespondenceItemProps })
    }, [correspondences])

    const list = useMemo(() => {
        return Object.keys(reduce_by_patients).map((patient_id: string) => {
            const item = reduce_by_patients[patient_id]
            return {
                patient_id,
                full_name: item.full_name,
                recare_due_date: item.recare_due_date,
                items: item.items,
            }
        }).sort((a, b) => +b.recare_due_date - +a.recare_due_date)
    }, [reduce_by_patients])

    return (
            <>
                <div className='text-xl font-bold mb-1 pt-6'>Recare Follow-up</div>
                <div className='mb-4 text-sm text-gray-700'>Updated {dayjs(fetched_at).fromNow()}</div>
                <RecareFilters
                    filters={filters}
                    setFilters={setFilters}
                    reload={reload}
                />
                {loading && <div className='py-16 text-center animate-pulse bg-slate-100 my-8 rounded-50'>
                    {loading}
                </div>}
                <RecareList items={list} />
            </>
    )
}

export default RecareReport