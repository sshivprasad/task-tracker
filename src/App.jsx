import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import Sidebar from '@/components/Sidebar'
import DayView from '@/pages/DayView'
import { format } from 'date-fns'

function App() {
  const today = format(new Date(), 'yyyy-MM-dd')
  return (
    <BrowserRouter>
      <TooltipProvider>
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to={`/day/${today}`} replace />} />
              <Route path="/day/:date" element={<DayView />} />
            </Routes>
          </main>
        </div>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
