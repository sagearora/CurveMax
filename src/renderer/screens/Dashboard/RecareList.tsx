import React from 'react'
import { useTodos } from '../../components/todos/TodosProvider'
import CorrespondenceItem, { CorrespondenceItemProps } from './CorrespondenceItem'

function RecareList({
    items,
}: {
    items: CorrespondenceItemProps[]
}) {
    const { todos } = useTodos()
    return (
        <div>
            {items.map((patient) => (
                <CorrespondenceItem key={patient.patient_id}
                    {...patient}
                    todos={todos[patient.patient_id]}
                />
            ))}
        </div>
    )
}

export default RecareList