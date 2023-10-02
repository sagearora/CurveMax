import React from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import DashboardScreen from './Dashboard/DashboardScreen'
import PatientRecareScreen from './PatientRecare/PatientRecareScreen'

const router = createHashRouter([
    {
        path: "/",
        element: <Layout />,
        children: [{
            path: "",
            element: <DashboardScreen />,
            children: [{
                path: ':patient_id',
                element: <PatientRecareScreen />
            }]
        }]
    }
])

function AppRouter() {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRouter