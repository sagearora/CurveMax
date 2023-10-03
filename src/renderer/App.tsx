import React, { useEffect, useState } from 'react'
import './App.css'
import RootContextProvider from './lib/RootContextProvider'
import AppRouter from './screens/AppRouter'
import { Toaster } from "@/components/ui/toaster"



function App() {
  const [token, setToken] = useState<string | undefined>(undefined)
  const [base_url, setBaseUrl] = useState<string | undefined>(undefined)
  const [base_gro_url, setBaseGroUrl] = useState<string|undefined>(undefined)

  useEffect(() => {
    const unsub = window.electron.ipcRenderer.on('init_response', (data) => {
      if (typeof data === 'string') {
        const { token, base_url, base_gro_url } = JSON.parse(data)
        setToken(token)
        setBaseUrl(base_url)
        setBaseGroUrl(base_gro_url)
      }
    })
    window.electron.ipcRenderer.sendMessage('init')
    return () => unsub()
  }, [])

  if (!token || !base_url || !base_gro_url) {
    return <div>
      Missing token/base url
    </div>
  }

  return (
    <RootContextProvider
      token={token}
      base_url={base_url}
      base_gro_url={base_gro_url}>
      <AppRouter />
      <Toaster />
    </RootContextProvider>
  )
}

export default App