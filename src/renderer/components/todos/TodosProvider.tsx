import React, { ReactElement } from 'react'
import { Todo } from '../../backend/types'
import { useRootContext } from '../../lib/RootContextProvider'
import { useListTodos } from './useListTodos'

export type TodosContextType = {
    todos: Record<string, Todo[]>
    refresh: () => void
    loading?: boolean
}

const TodosContext = React.createContext<TodosContextType>({} as TodosContextType)

function TodosProvider({
    children,
}: {
    children: ReactElement | ReactElement[]
}) {
    const { base_url } = useRootContext()
    const { todos, loading, refresh } = useListTodos(base_url)

    return (
        <TodosContext.Provider value={{
            todos,
            refresh,
            loading,
        }}>
            {children}
        </TodosContext.Provider>
    )
}

export const useTodos = () => React.useContext(TodosContext)

export default TodosProvider