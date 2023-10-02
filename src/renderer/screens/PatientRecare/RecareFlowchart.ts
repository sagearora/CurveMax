import { StepProps } from "./StepProps"

export const RecareFlowchart = (
    patient_name: string,
    user_name: string,
    practice_name: string,
): {
    [id: string]: StepProps
} => ({
    "start": {
        "message": `Call ${patient_name} for Recare booking`,
        "script": `Hello, may I speak with ${patient_name}? This is ${user_name} calling from ${practice_name}.`,
        "options": [{
            "label": "Call Now",
            "nextStep": "didAnswer"
        }],
    },
    "didAnswer": {
        "message": `Did ${patient_name} Answer?`,
        "script": "",
        "options": [
            {
                "label": "Yes",
                "nextStep": "discussExp"
            },
            {
                "label": "No",
                "nextStep": "leaveMessage"
            }
        ]
    },
    "discussExp": {
        "message": "Discuss Experience & Importance of Recare",
        "script": `Hi ${patient_name}, how are you doing?
        It's so good to hear from you. I noticed that you are due for your cleaning and checkup and 
        as you know, regular visits are super important to keep your teeth healthy and catch any issues early. 
        ${patient_name}, do you have 2 minutes to schedule your visit now?`,
        "options": [
            {
                "label": "Yes",
                "nextStep": "bookingConfirmed",
                action: {
                    description: `Booking made by ${user_name} with CurveMax`,
                    nextStep: 'done',
                }
            },
            {
                "label": "No",
                "nextStep": "discussConcern"
            }
        ]
    },
    "leaveMessage": {
        "message": "Leave a message and Follow up after 3 days",
        "script": `Hello ${patient_name}, this is ${user_name} from ${practice_name}. 
        I am calling to remind you about your upcoming dental check-up and cleaning. 
        Please call us back at [office phone number] to schedule your appointment. Thank you!`,
        "options": [{
            "label": "Schedule Follow Up",
            "nextStep": "done",
            "action": {
                days: 3,
                description: 'Voicemail left for patient for recare. Please follow up in 3 days',
                nextStep: 'done',
            }
        }]
    },
    "discussConcern": {
        "message": "Discuss Concerns & Re-emphasize Importance",
        "script": `I understand you might have concerns, ${patient_name}. 
        Your dental health is our priority and regular check-ups are vital to prevent any unforeseen issues. 
        Is there a specific reason that’s making you hesitant?`,
        "options": [
            {
                "label": "Ready To Book",
                "nextStep": "bookingConfirmed",
                action: {
                    description: `Booking made by ${user_name} with CurveMax`,
                    nextStep: 'done',
                }
            },
            { "label": "Not Ready To Book", "nextStep": "offerFollowUp" }]
    },
    "offerFollowUp": {
        "message": "Offer Follow-Up Call/Text",
        "script": `No worries, ${patient_name}. Would it be alright if I 
        followed up with you in a few weeks to check in and possibly schedule your appointment then?`,
        "requireNote": true,
        "options": [{
            "label": "Create Follow Up Note",
            "nextStep": "done",
            "action": {
                description: `Follow up for recare in 2 weeks. ${patient_name} had the following concerns:`,
                nextStep: 'done',
                days: 14
            }
        }]
    },
    "bookingConfirmed": {
        "message": "Booking Confirmed. Thank You & Send Appointment Reminder",
        "script": `Fantastic, ${patient_name}! I have you booked for [date and time]. I’ll send you a reminder as we get closer the date! Have a wonderful day`,
        "options": [
        ]
    },
    "done": {
        "message": "Done",
        "script": "Good job. On to the next one :)",
        "options": []
    }
})