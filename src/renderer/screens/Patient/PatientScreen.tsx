import React from 'react'
import { useParams } from 'react-router-dom'
import MessageHistory from '../../components/messaging/MessageHistory'
import MessagingProvider from '../../components/messaging/MessageProvider'
import NoteList from '../../components/notes/Notes'
import NotesProvider from '../../components/notes/NotesProvider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import AppointmentBooking from '../PatientRecare/BookingHelper'
import RecareInfo from '../PatientRecare/RecareInfo'
import { useGetPatient } from './useGetPatient'

function PatientScreen() {
    const patient_id = useParams().patient_id as string
    const { patient, loading } = useGetPatient(patient_id)

    if (loading) {
        return <div className='animate-pulse'>
            <div className='h-4 w-50 bg-slate-200'></div>
        </div>
    }

    if (!patient) {
        return <div>Not Found</div>
    }

    return (
        <>
            <div className='text-2xl font-bold'>{patient.firstName} {patient.lastName}</div>
            <div>{patient.birthDate}</div>
            <RecareInfo
                patient_id={patient_id}
            />
            <NotesProvider patient_id={patient_id}>
                <MessagingProvider phone={patient.mobilePhone.number}>
                    <div className='py-4'>
                        <AppointmentBooking
                            patient_name={`${patient.firstName}`}
                        />
                    </div>
                    <Tabs defaultValue="messages" className='border-b'>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="messages">
                            <MessageHistory
                                phone={patient.mobilePhone.number} />
                        </TabsContent>
                        <TabsContent value="notes">
                            <NoteList />
                        </TabsContent>
                    </Tabs>
                </MessagingProvider>
            </NotesProvider>
        </>
    )
}

export default PatientScreen