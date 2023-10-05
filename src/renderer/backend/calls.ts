import { RecareEnabledColumns, RecareReportsId as RecareReportId, RecareReportName, ReportCategory } from "./constants"
import { AppointmentSummary, Correspondence, Note, PatientProfile, RecareInfo, SearchResult, Todo, UserInfo } from "./types"

export const listCorrespondences = async ({
    base_url,
    activity,
    startDate,
    endDate,
}: {
    base_url: string
    activity: string
    startDate: string
    endDate: string
}) => {
    const form_data = new FormData()
    form_data.append('json', `{"activity":"${activity}","startDate":"${startDate}","endDate":"${endDate}"}`)
    const res = await fetch(`https://${base_url}/activity_log/listing`, {
        method: 'POST',
        body: form_data
    })
    console.log(res)
    return ((await res.json())?.items || []) as Correspondence[]
}


export const getNotes = async ({
    base_url,
    patient_id
}: {
    base_url: string
    patient_id: string
}) => {
    try {
        const res = await fetch(`https://${base_url}/cheetah/notes/?ak=/cheetah/notes/&contactId=${patient_id}`, {
            method: 'GET',
        })
        return (((await res.json()) || []) as Note[])
    } catch (e) {
        return []
    }
}

export const getAppointments = async ({
    base_url,
    patient_id,
}: {
    base_url: string
    patient_id: string
}) => {
    const res = await fetch(`https://${base_url}/calendar_event/getPastPatientAppointments/?patientId=${patient_id}`, {
        method: 'GET',
    })
    const data = await res.json()
    return JSON.parse(data.jsonData) as AppointmentSummary[]
}

export const getRecareInfo = async ({
    base_url,
    patient_id,
}: {
    base_url: string
    patient_id: string
}) => {
    const res = await fetch(`https://${base_url}/patient/getRecareInfo/?patientIds=${patient_id}`, {
        method: 'GET',
    })
    const data = await res.json()
    return (data?.recareResults || []) as RecareInfo[]
}

export const createNote = async ({
    base_url,
    patient_id,
    description,
    due_date,
}: {
    base_url: string
    patient_id: string
    description: string
    due_date?: string
}) => {
    const form_data = new FormData()
    const tags = [{
        id: "10",
        name: "Recare"
    }]
    if (due_date) {
        tags.push({
            id: "26",
            name: "Memo"
        })
    }
    const note = {
        note: {
            description,
            patient_id,
            todo: due_date ? {
                due_date,
            } : null,
        },
        tags: JSON.stringify(tags),
        lockNote: false,
        isFamilyNote: false,
    }
    // {"note":{"description":"follow up with voicemail about recare.","patient_id":837,"todo":{"due_date":"2023-10-07"}},"tags":"[{\"id\":\"26\",\"name\":\"Memo\"}]","lockNote":false,"isFamilyNote":false}
    form_data.append('json', JSON.stringify(note))
    const res = await fetch(`https://${base_url}/note`, {
        method: 'POST',
        body: form_data
    })
    return await res.json() as {
        success: boolean
        item: Note
    }
}

export const completeTodoOrMemo = async ({
    base_url,
    note_id,
}: {
    base_url: string
    note_id: number
}) => {
    const res = await fetch(`https://${base_url}/note/completeTodoOrMemo/${note_id}`, {
        method: 'POST',
    })
    return await res.json() as {
        success: boolean
        item: Note
    }
}

export const getUserInfo = async ({
    base_url,
}: {
    base_url: string
}) => {
    const res = await fetch(`https://${base_url}/cheetah/userinfo`, {
        method: 'GET',
    })
    if (res.status === 200) {
        return (await res.json()) as UserInfo
    }
    return null
}

const getReportColumns = async ({
    base_url,
    report_id,
}: {
    base_url: string,
    report_id: number
}) => {
    const res = await fetch(`https://${base_url}/reports/get_columns/${report_id}`, {
        method: 'GET',
    })
    return ((await res.json())?.structure || []) as {
        field: string
        column_id: string
        name: string
        col_type: string
        hidden: boolean
    }[]
}

export const createReport = async ({
    base_url,
    parent_report_id,
    report_category,
    report_name,
    columns,
}: {
    base_url: string
    parent_report_id: number
    report_name: string
    report_category: string
    columns: any[]
}) => {
    const form_data = new FormData()
    form_data.append('parent_report_id', parent_report_id.toString())
    form_data.append('report_category', report_category)
    form_data.append('report_name', report_name)
    form_data.append('columns', JSON.stringify(columns))
    const res = await fetch(`https://${base_url}/reports/save_as`, {
        method: 'POST',
        body: form_data
    })
    return await res.json() as {
        success: boolean
        report_id: string
    }

}

export const setupRecareReport = async ({
    base_url
}: {
    base_url: string,
}) => {
    const columns = await getReportColumns({
        base_url,
        report_id: RecareReportId
    })
    const newReport = await createReport({
        base_url,
        parent_report_id: RecareReportId,
        report_category: ReportCategory,
        report_name: RecareReportName,
        columns: columns.map(col => ({
            ...col,
            hidden: RecareEnabledColumns.indexOf(col.name) === -1,
        }))
    })
    if (newReport.success) {
        return newReport.report_id
    }
    return null
}

export const listAllReports = async ({ base_url }: {
    base_url: string
}) => {
    const res = await fetch(`https://${base_url}/reports/report_list?type=custom`, {
        method: 'GET',
    })
    return await res.json() as {
        [id: string]: {
            id: string
            name: string
        }[]
    }
}

export const queryReport = async ({
    base_url,
    report_template_id,
    filters,
}: {
    base_url: string
    report_template_id: string
    filters?: any[]
}) => {
    const res = await fetch(`https://${base_url}/cheetah/queued_report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            params: {
                format: "json",
                limit: 2500,
                report_id: report_template_id,
                filters,
            },
            report_id: report_template_id,
        }),
    })
    const result = await res.json() as {
        status: string
        id: string
    }
    if (result.status === 'queued') {
        return result.id
    }
    return null
}

export const checkIsReportDone = async ({
    base_url,
    report_id,
}: {
    base_url: string
    report_id: string
}) => {
    const res = await fetch(`https://${base_url}/cheetah/queued_report/${report_id}`, {
        method: 'GET',
    })
    const result = await res.json() as {
        status: string
        id: string
    }
    return result.status === 'done'
}

export const downloadReport = async <T>({
    base_url,
    report_id,
}: {
    base_url: string
    report_id: string
}) => {
    const res = await fetch(`https://${base_url}/cheetah/queued_report/${report_id}/result.json`, {
        method: 'GET',
    })
    const result = await res.json() as {
        items: T[]
        numRows: number
    }
    return result
}

export const getPatient = async ({
    base_url,
    patient_id,
}: {
    base_url: string
    patient_id: string
}) => {
    const res = await fetch(`https://${base_url}/profile/${patient_id}`, {
        method: 'GET',
    })
    const data = await res.json() as PatientProfile
    return data
}

export const listTodos = async ({
    base_url,
    filter = 'all'
}: {
    base_url: string
    filter?: string
}) => {
    const res = await fetch(`https://${base_url}/note/todos?filter=${filter}`, {
        method: 'GET',
    })
    const data = (await res.json() || []) as Todo[]
    return data
}

export const deleteNote = async ({
    base_url,
    note_id,
}: {
    base_url: string
    note_id: number
}) => {
    const res = await fetch(`https://${base_url}/note/delete/${note_id}`, {
        method: 'POST',
    })
    const data = await res.json()
    return data
}

export const searchCurve = async ({
    base_url,
    query,
}: {
    base_url: string
    query: string
}) => {
    const res = await fetch(`https://${base_url}/cheetah/contacts/search?filter=${query}&statuses=&fields=clientNumber%2Caddress%2Cphones%2Cstatus%2Cnames%2Cnickname%2Csubscriber%2Cdob%2Cthumbnail%2Ccategory&start=0`, {
        method: 'GET',
    })
    const data = await res.json()
    return data as SearchResult
}