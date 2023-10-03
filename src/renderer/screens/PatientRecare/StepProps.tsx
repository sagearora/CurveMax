export type StepOption = {
    label: string
    nextStep: string
    action?: {
        text?: boolean
        call?: boolean
        note?: {
            days?: number
            description: string
        }
    };
    text?: boolean;
}
export interface StepProps {
    message: string;
    script: string;
    options: StepOption[];
    requireNote?: boolean
    note?: string
}
