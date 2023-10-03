export type UserInfo = {
    "x-cdnewco-username": string;
    "x-cdnewco-user_id": string;
    sub: string;
    email: string;
    name: string;
    given_name: string;
    middle_name: string | null;
    family_name: string;
}

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

export type RecareReportRow = {
    rp_id: string;
    user_id: string;
    "Recare Type": string;
    "Recare Status": string;
    "Recare Freq. Months": string;
    "Recare Freq. Days": string;
    "Recare Due Date": string;
    "Recare Last Visit Date": string | null;
    "Recare Last Visit Time": string | null;
    "Recare Last Visit Length": string | null;
    "Recare Last Visit Description": string | null;
    "Recare Last Visit Tags": string | null;
    "Recare Last Visit Procedures": string | null;
    "Recare Next Visit Date": string | null;
    "Recare Next Visit Time": string | null;
    "Recare Next Visit Length": string | null;
    "Recare Next Visit Description": string | null;
    "Recare Next Visit Tags": string | null;
    "Recare Next Visit Procedures": string | null;
    "Full Name": string;
    "Patient Contact ID": string;
    "First Name": string;
    "Last Name": string;
    "Middle Name": string | null;
    "Nick Name": string;
    Status: string;
    "Date Became New Patient": string;
    Gender: string;
    "Preferred Language": string;
    "Date of Birth": string;
    "Home Phone": string;
    Mobile: string;
    "Work Phone": string;
    Fax: string | null;
    Email: string;
    "Preferred Contact Method": string;
    "Social Security Number": string | null;
    "Referral Source": string | null;
    "Family Members": string;
    "Default Doctor": string;
    "Default Hyg.": string | null;
    "Profile Created Date": string;
    "Profile Created By": string;
    "HoH Email": string;
    "HoH Full Name": string;
    "HoH Contact ID": string;
    "Next Appt Date": string | null;
    "Next Appt Description": string | null;
    "Last Appt. Date": string;
    "Last Appt. Description": string | null;
    "RP Email": string;
    "Has Insurance Coverage?": string;
    "RP Full Name": string;
    "RP Contact ID": string;
    "RP Profile Tags": string | null;
    "Total Owing": string;
    Credit: string;
    "Prim. Insurance Plan": string;
    "Sec. Insurance Plan": string | null;
    "Prim. Basic Amt.": string | null;
    "Sec. Basic Amt.": string | null;
    "Prim. Remaining Basic Amt.": string | null;
    "Sec. Remaining Basic Amt.": string | null;
    "Prim. Used Basic Amt.": string;
    "Sec. Used Basic Amt.": string | null;
    "Prim. Basic Limit": string;
    "Sec. Basic Limit": string | null;
    "First Appointment Date": string;
    id: number;
}


export type Phone = {
    number: string;
    extension?: string;
};

export type Address = {
    line1: string;
    line2: string;
    city: string;
    country: string;
    province: string;
    postal: string;
};

export type PatientProfile = {
    firstName: string;
    middleName: string;
    lastName: string;
    nickname: string;
    userPrefix: string;
    userSuffix: string;
    gender: string;
    email: string;
    status: string;
    birthDate: string;
    specialStatus: string;
    preferredLanguage: string;
    preferredContactMethod: string;
    mailingAddress: Address;
    billingAddress: Address;
    mobilePhone: Phone;
    homePhone: Phone;
    workPhone: Phone;
};

export type Todo = {
    id: number
    created_at: string
    description: string
    patient_id: number
    created_by_id: number
    todo?: {
        due_date: string
    }
    note_tags?: { name: string }[]
}

export interface SearchItem {
    id: string;
    client_number: string;
    address_line1: string;
    address_line2: string | null;
    home_phone_number: string | null;
    home_phone_extension: string;
    work_phone_number: string | null;
    work_phone_extension: string;
    cell_phone_number: string;
    cell_phone_extension: string;
    status: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    nick_name: string;
    is_subscriber: boolean;
    dob: string;
    thumb: string | null;
    category: string;
}

export interface SearchResult {
    label: string;
    items: SearchItem[];
}