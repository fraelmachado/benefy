import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
      <BottomNav />
    </div>
  )
}
