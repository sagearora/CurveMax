export type StepOption = {
    label: string
    nextStep: string
    action?: any;
}
export interface StepProps {
    message: string;
    script: string;
    options: StepOption[];
    requireNote?: boolean
}
