import React from 'react'
import { useTodos } from '../../components/todos/TodosProvider'
import RecareListItem, { CorrespondenceItemProps } from './RecareListItem'

function RecareList({
    items,
}: {
    items: CorrespondenceItemProps[]
}) {
    const { todos } = useTodos()
    return (
        <div className='py-8'>
            {items.map((patient) => (
                <RecareListItem key={patient.patient_id}
                    {...patient}
                    todos={todos[patient.patient_id]}
                />
            ))}
        </div>
    )
}

export default RecareList