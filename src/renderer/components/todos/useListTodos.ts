import { useCallback, useEffect, useMemo, useState } from "react"
import { listTodos } from "../../backend/calls"
import { Todo } from "../../backend/types"
import { createErrorToast } from "../../lib/createErrorToast"

export const useListTodos = (base_url: string) => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(false)

    const refresh = useCallback(async () => {
        try {
            setLoading(true)
            const todos = await listTodos({ base_url })
            setTodos(todos)
        } catch (e) {
            createErrorToast(e)
        } finally {
            setLoading(false)
        }
    }, [base_url])

    useEffect(() => {
        refresh()
    }, [base_url])

    const todos_by_patient = useMemo(() => todos.reduce((acc, todo) => {
        if (!acc[todo.patient_id]) {
            acc[todo.patient_id] = []
        }
        acc[todo.patient_id].push(todo)
        return acc
    }, {} as Record<string, Todo[]>), [todos])


    return {
        todos: todos_by_patient,
        loading,
        refresh,
    }
}