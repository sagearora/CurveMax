import { AppointmentSummary, Correspondence, Note, RecareInfo } from "./types"

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
    const res = await fetch(`https://${base_url}/cheetah/notes/?ak=/cheetah/notes/&contactId=${patient_id}`, {
        method: 'GET',
    })
    console.log(res)
    return (((await res.json()) || []) as Note[]).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
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