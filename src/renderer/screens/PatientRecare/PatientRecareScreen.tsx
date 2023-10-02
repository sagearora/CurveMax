import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPatient } from '../../backend/calls'
import { PatientProfile } from '../../backend/types'
import NoteList from '../../components/notes/Notes'
import { useRootContext } from '../../lib/RootContextProvider'
import RecareInfo from './RecareInfo'
import AppointmentBooking from './BookingHelper'
import NotesProvider from '../../components/notes/NotesProvider'

function PatientRecareScreen() {
    const { base_url } = useRootContext()
    const patient_id = useParams().patient_id as string
    const [loading, setLoading] = useState(false)
    const [patient, setPatient] = useState<PatientProfile>()

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const patient = await getPatient({
                    base_url,
                    patient_id
                })
                setPatient(patient)
            } finally {
                setLoading(false)
            }
        })();
    }, [patient_id, base_url])

    if (loading) {
        return <div className='animate-pulse'>
            <div className='h-4 w-50 bg-slate-200'></div>
        </div>
    }

    if (!patient) {
        return <div>Not Found</div>
    }

    return (
        <div>
            <div className='text-2xl font-bold'>{patient.firstName} {patient.lastName}</div>
            <div>{patient.birthDate}</div>
            <RecareInfo
                patient_id={patient_id}
            />
            <NotesProvider patient_id={patient_id}>
                <AppointmentBooking
                    patient_name={`${patient.firstName}`}
                />
                <NoteList />
            </NotesProvider>
        </div>
    )
}

export default PatientRecareScreen