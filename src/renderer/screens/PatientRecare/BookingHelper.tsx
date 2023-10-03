import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useMessaging } from '../../components/messaging/MessageProvider';
import { useNotes } from '../../components/notes/NotesProvider';
import { useTodos } from '../../components/todos/TodosProvider';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { useRootContext } from '../../lib/RootContextProvider';
import { RecareFlowchart } from './RecareFlowchart';
import { StepOption, StepProps } from './StepProps';

const Step: React.FC<{
    step: StepProps
    onSelect: (opt: StepOption, note?: string) => void;
}> = ({ step, onSelect }) => {
    const [note, setNote] = useState(step.note || '')
    const [error, setError] = useState('')

    const select = (opt: StepOption) => {
        if (step.requireNote && !note) {
            setError('Please enter a note')
            return
        }
        onSelect(opt, note)
    }

    return (
        <div className="py-2">
            <p className="mb-4 font-bold">{step.message}</p>
            <p className="mb-4 italic">{step.script}</p>
            {step.requireNote && <div className='mb-4'>
                <Textarea placeholder='Type a note...' value={note} onChange={e => setNote(e.target.value)} />
                {error && <div className='text-red-500 text-sm'>Please enter a note</div>}
            </div>}
            <div className='space-x-2'>
                {step.options.map((opt, idx) => (
                    <Button
                        variant='outline'
                        key={idx}
                        onClick={() => select(opt)}
                    >
                        {opt.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}

const AppointmentBooking = ({
    patient_name,
}: {
    patient_name: string
}) => {
    const { refresh: refreshTodos } = useTodos()
    const { addNote } = useNotes()
    const { sendMessage, phone } = useMessaging()
    const { user: {given_name}, practice_name } = useRootContext()
    const [completedSteps, setCompletedSteps] = useState<string[]>(['start']);

    const steps = useMemo(() => RecareFlowchart(
        patient_name,
        phone,
        given_name,
        practice_name,
    ), [patient_name, given_name, practice_name])


    const handleSelect = async (opt: StepOption, content?: string) => {
        if (opt.action) {
            const { call, text, note } = opt.action
            if (text && content) {
                await sendMessage(
                    content,
                )
            }
            if (call) {
                location.href = `tel:${phone}`
            }
            if (note) {
                await addNote(
                    `${note.description}${content ? `<br\>${content}` : ''}`,
                    note.days ? dayjs().add(note.days, 'd').format('YYYY-MM-DD') : undefined
                );
                refreshTodos()
            }
        }
        setCompletedSteps([...completedSteps, opt.nextStep]);
    };

    const goBack = () => {
        setCompletedSteps(c => c.slice(0, -1))
    }

    return (
        <>
            {completedSteps.length > 1 && <Button variant='ghost' onClick={goBack}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clipRule="evenodd" />
                </svg>
                Back</Button>}
            {completedSteps.slice(-1).map(stepKey => (
                <Step
                    key={stepKey}
                    step={steps[stepKey]}
                    onSelect={handleSelect}
                />
            ))}
        </>
    );
};

export default AppointmentBooking;