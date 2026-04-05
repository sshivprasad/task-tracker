import { useState, useRef } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { exportAllData, importAllData } from '@/db'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function ExportImport({ open, onClose }) {
  const [importing, setImporting] = useState(false)
  const [confirmImport, setConfirmImport] = useState(null)
  const [status, setStatus] = useState(null)
  const fileRef = useRef(null)

  async function handleExport() {
    try {
      const data = await exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `work-tracker-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setStatus({ type: 'success', message: 'Export downloaded successfully!' })
    } catch {
      setStatus({ type: 'error', message: 'Export failed. Please try again.' })
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!data.version || !data.exportedAt) {
          setStatus({ type: 'error', message: 'Invalid backup file.' })
          return
        }
        setConfirmImport(data)
      } catch {
        setStatus({ type: 'error', message: 'Could not parse file. Is it a valid backup?' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleConfirmImport() {
    setImporting(true)
    try {
      await importAllData(confirmImport)
      setConfirmImport(null)
      setStatus({ type: 'success', message: `Imported ${confirmImport.tasks?.length ?? 0} tasks across ${confirmImport.workdays?.length ?? 0} days.` })
    } catch {
      setStatus({ type: 'error', message: 'Import failed. Your existing data is unchanged.' })
    } finally {
      setImporting(false)
    }
  }

  function handleClose() {
    setStatus(null)
    setConfirmImport(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export / Import Data</DialogTitle>
          <DialogDescription>
            Back up your data or restore it on a new device.
          </DialogDescription>
        </DialogHeader>

        {confirmImport ? (
          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">This will overwrite all existing data.</p>
                <p className="text-amber-600 mt-1">
                  File contains <strong>{confirmImport.tasks?.length ?? 0} tasks</strong> across{' '}
                  <strong>{confirmImport.workdays?.length ?? 0} days</strong>.
                  <br />Exported on {new Date(confirmImport.exportedAt).toLocaleDateString()}.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleConfirmImport} disabled={importing} className="flex-1">
                {importing ? 'Importing…' : 'Yes, replace my data'}
              </Button>
              <Button variant="outline" onClick={() => setConfirmImport(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {status && (
              <div className={`text-sm px-3 py-2 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status.message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all group"
              >
                <Download size={22} className="text-slate-400 group-hover:text-violet-500" />
                <div className="text-center">
                  <p className="text-sm font-medium">Export</p>
                  <p className="text-xs text-muted-foreground">Download .json backup</p>
                </div>
              </button>

              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all group"
              >
                <Upload size={22} className="text-slate-400 group-hover:text-teal-500" />
                <div className="text-center">
                  <p className="text-sm font-medium">Import</p>
                  <p className="text-xs text-muted-foreground">Restore from backup</p>
                </div>
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
