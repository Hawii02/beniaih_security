import React from 'react'

const DashboardFooter = () => {
  return (
    <footer className='flex shrink-0 items-center justify-center gap-2 border-t border-slate-300 h-12 ease-linear'>
      <span className='text-slate-700 font-extralight'>&copy; {new Date().getFullYear()} Benaiah Security. All Rights Reserved.</span>
    </footer>
  )
}

export default DashboardFooter
