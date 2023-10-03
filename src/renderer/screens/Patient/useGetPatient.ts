import { useCallback, useEffect, useState } from "react"
import { useRootContext } from "../../lib/RootContextProvider"
import { PatientProfile } from "../../backend/types"
import { getPatient } from "../../backend/calls"

export const useGetPatient = (
    patient_id: string
) => {
    const { base_url } = useRootContext()
    const [loading, setLoading] = useState(false)
    const [patient, setPatient] = useState<PatientProfile>()

    const refresh = useCallback(async () => {
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
    }, [base_url, patient_id])

    useEffect(() => {
        refresh()
    }, [refresh, patient_id, base_url])

    return {
        refresh,
        patient,
        loading,
    }
}