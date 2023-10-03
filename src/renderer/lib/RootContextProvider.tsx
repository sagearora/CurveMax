import React, { ReactElement, createContext, useContext, useEffect } from 'react'
import { getUserInfo, listAllReports, setupRecareReport } from '../backend/calls'
import { Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { RecareReportName, ReportCategory } from '../backend/constants'
import { UserInfo } from '../backend/types'

export type RootContextProps = {
  base_url: string
  base_gro_url: string
  token: string
  user: UserInfo
  recare_report_id: string
  practice_name: string
  logout: () => void
}

const RootContext = createContext<RootContextProps>({} as RootContextProps)


function RootContextProvider({
  children,
  base_url,
  base_gro_url,
  token,
}: {
  children: ReactElement | ReactElement[]
  base_url: string
  base_gro_url: string
  token: string
}) {
  const [loading_user, setLoadingUser] = React.useState(false)
  const [loading_reports, setLoadingReports] = React.useState(false)
  const [user, setUser] = React.useState<UserInfo | undefined>(undefined)
  const [recare_report_id, setRecareReportId] = React.useState<string | null>(null)

  const logout = () => {
    window.electron.ipcRenderer.sendMessage('signout')
  }

  useEffect(() => {
    (async () => {
      try {
        setLoadingUser(true)
        const data = await getUserInfo({ base_url })
        if (!data) {
          return;
        }
        setUser(data)
      } finally {
        setLoadingUser(false)
      }
    })();
  }, [base_url])

  useEffect(() => {
    (async () => {
      try {
        setLoadingReports(true)
        const reports = await listAllReports({
          base_url,
        })
        if (reports[ReportCategory]) {
          const recare_report = reports[ReportCategory].find(r => r.name === RecareReportName)
          setRecareReportId(recare_report?.id || null)
        }
      } finally {
        setLoadingReports(false)
      }
    })();
  }, [base_url])

  const createReport = async () => {
    const report_id = await setupRecareReport({
      base_url,
    })
    setRecareReportId(report_id)
  }

  if (loading_user || loading_reports) {
    return <div><Loader2 className='h-4 w-4 animate-spin' /></div>
  }

  if (!user) {
    return <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
      <div className='text-4xl font-bold'>
        Welcome back
      </div>
      <div>Looks like your session expired</div>
      <Button onClick={logout}>Login</Button>
    </div>
  }

  if (!recare_report_id) {
    return <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
      <div className='text-4xl font-bold'>
        Welcome to CurveMax
      </div>
      <Button onClick={createReport}>Create Recare Report</Button>
    </div>
  }

  return (
    <RootContext.Provider value={{
      base_url,
      base_gro_url,
      token, 
      user,
      recare_report_id,
      practice_name: 'Arora Dental',
      logout,
    }}>
      {children}
    </RootContext.Provider>
  )
}


export const useRootContext = () => {
  return useContext(RootContext);
}

export default RootContextProvider