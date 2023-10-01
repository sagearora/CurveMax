import './App.css'
import React, { useEffect, useState } from 'react'
import Footer from './components/Footer'
import DashboardScreen from './screens/Dashboard/DashboardScreen'
import RootContextProvider from './lib/RootContextProvider'



function App() {
  const [token, setToken] = useState<string | undefined>(undefined)
  const [base_url, setBaseUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    const unsub = window.electron.ipcRenderer.on('init-response', (data) => {
      if (typeof data === 'string') {
        const { token, base_url } = JSON.parse(data)
        setToken(token)
        setBaseUrl(base_url)
      }
    })
    window.electron.ipcRenderer.sendMessage('init')
    return () => unsub()
  }, [])

  if (!token || !base_url) {
    return <div>
      Missing token/base url
    </div>
  }

  return (
    <RootContextProvider
      token={token}
      base_url={base_url}>
      <DashboardScreen />
      <Footer base_url={base_url} token={token} />
    </RootContextProvider>
  )
}

export default App