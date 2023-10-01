export type Correspondence = {
    activity: string;
    description: string;
    log_date: string;
    type: string;
    patient_id: string;
    patient_full_name: string;
    household_head_id: string;
    responsible_party_id: string;
    user_id: string;
    user_full_name: string;
};

export type Note = {
    id: number
    description: string
    created_at: string
    updated_at?: string
    note_tags: {
        id: number;
        name: string
    }[]
}

export type AppointmentSummary = {
    id: string;
    starttime_at: string;
    length: string;
    patient: {
        full_name: string;
    };
    provider: {
        full_name: string;
    };
    description: string;
    operatory_id: string;
};

export type RecareInfo = {
    id: string;
    name: string;
    frequency_months: string;
    frequency_days: string;
    last: null | string;
    next: string;
    due: null | string;
    overdue: string;
    patient_id: string;
    appointment_tag_id: string;
    provider_id: string;
    patient_name: string;
    default_units: null | string;
  };