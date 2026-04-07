import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { removeToast, type Toast as ToastType } from '../../features/toast/toastSlice'

const ToastIcon = ({ type }: { type: ToastType['type'] }) => {
  const iconClass = 'w-5 h-5'
  
  switch (type) {
    case 'success':
      return <CheckCircle className={`${iconClass} text-success`} />
    case 'error':
      return <AlertCircle className={`${iconClass} text-destructive`} />
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-warning`} />
    case 'info':
    default:
      return <Info className={`${iconClass} text-info`} />
  }
}

const ToastItem = ({ toast }: { toast: ToastType }) => {
  const dispatch = useAppDispatch()
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        dispatch(removeToast(toast.id))
      }, 300)
    }, toast.duration)

    return () => clearTimeout(timer)
  }, [dispatch, toast.id, toast.duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      dispatch(removeToast(toast.id))
    }, 300)
  }

  const bgColors = {
    success: 'bg-success/10 border-success/20',
    error: 'bg-destructive/10 border-destructive/20',
    warning: 'bg-warning/10 border-warning/20',
    info: 'bg-info/10 border-info/20',
  }

  return (
    <div
      className={`
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
        bg-card ${bgColors[toast.type]}
        min-w-[320px] max-w-[420px]
      `}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1 text-sm font-medium text-card-foreground">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="p-1 rounded-md hover:bg-muted transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  )
}

export const ToastContainer = () => {
  const toasts = useAppSelector((state) => state.toast.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
