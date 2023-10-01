import React, { ReactElement, createContext, useContext } from 'react'

export type RootContextProps = {
  base_url: string
  token: string
}

const RootContext = createContext<RootContextProps>({} as RootContextProps)


function RootContextProvider({
  children,
  base_url,
  token,
}: {
  children: ReactElement|ReactElement[]
  base_url: string
  token: string
}) {
  return (
    <RootContext.Provider value={{ base_url, token }}>
      {children}
    </RootContext.Provider>
  )
}


export const useRootContext = () => {
  return useContext(RootContext);
}

export default RootContextProvider