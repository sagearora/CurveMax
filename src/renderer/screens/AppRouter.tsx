import React from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import DashboardScreen from './Dashboard/DashboardScreen'
import PatientScreen from './Patient/PatientScreen'
import PatientRecareScreen from './PatientRecare/PatientRecareScreen'
import TodosProvider from '../components/todos/TodosProvider'

const router = createHashRouter([
    {
        path: "/",
        element: <Layout />,
        children: [{
            path: "",
            element: <DashboardScreen />,
            children: [{
                path: ':patient_id',
                element: <PatientScreen />
            }]
        },
        {
            path: 'p/:patient_id',
            element: <PatientScreen />
        }
        ]
    }
])

function AppRouter() {
    return (
        <TodosProvider>
            <RouterProvider router={router} />
        </TodosProvider>
    )
}

export default AppRouter