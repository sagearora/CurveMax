import React, { useEffect } from 'react'
import { Toggle } from "@/components/ui/toggle"
import { Button } from '../../components/ui/button'
import dayjs from 'dayjs'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { cn } from '../../lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../../components/ui/calendar'

function RecareFilters({
    filters,
    setFilters,
    reload,
}: {
    filters: any[]
    setFilters: (filters: any[]) => void
    reload: () => void
}) {
    const [show_active_only, setShowActiveOnly] = React.useState(true)
    const [show_scheduled, setShowScheduled] = React.useState(false)
    const [before_due_date, setBeforeDueDate] = React.useState<Date>(dayjs().add(1, 'd').toDate())

    useEffect(() => {
        const filters = []
        if (show_active_only) {
            filters.push({
                "column_name": "Status",
                "comparator": "equal to",
                "filter_value": "[\"Active\",\"New Patient\"]",
                "type": "enumerable",
                "filter_id": "0"
            })
        }
        if (!show_scheduled) {
            filters.push({
                "column_name": "Recare Next Visit Date",
                "comparator": "is empty",
                "filter_value": null,
                "type": "date",
                "filter_id": "0"
            })
        }
        filters.push({
            "column_name": "Recare Due Date",
            "comparator": "before date",
            "filter_value": dayjs(before_due_date).format('YYYY-MM-DD'),
            "type": "date",
            "filter_id": "0"
        })
        setFilters(filters)
    }, [show_active_only, show_scheduled, before_due_date, setFilters])

    return (
        <div className='flex space-x-2'>
            <Toggle pressed={show_active_only}
                onPressedChange={setShowActiveOnly}
                variant='outline'>
                {show_active_only && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                }
                Active</Toggle>
            <Toggle pressed={show_scheduled}
                onPressedChange={setShowScheduled}
                variant='outline'>
                {show_scheduled && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                }
                Scheduled
            </Toggle>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !before_due_date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {before_due_date ? dayjs(before_due_date).format('YYYY/MM/DD') : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={before_due_date}
                        onSelect={d => setBeforeDueDate(d as Date)}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Button onClick={reload}>Reload</Button>
        </div>
    )
}

export default RecareFilters