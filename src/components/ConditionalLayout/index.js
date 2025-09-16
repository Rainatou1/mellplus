'use client'

import { usePathname } from 'next/navigation'
import Header from '../Header'
import Footer from '../Footer'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  
  // Function to determine if header/footer should be hidden
  const shouldHideLayout = () => {
    // Hide on admin login page
    if (pathname === '/admin/login') {
      return true
    }
    
    // Hide on all other admin pages (they use their own admin layout)
    if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
      return true
    }
    
    return false
  }
  
  // If layout should be hidden, return only children
  if (shouldHideLayout()) {
    return <>{children}</>
  }
  
  // Otherwise, render with header and footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}