import { Navbar } from '@/components/navbar'
import { Protection } from '@/components/protection'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Protection />
      <Navbar />
      {children}
    </>
  )
}

export default Layout
