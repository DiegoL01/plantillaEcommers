'use client'

import { AlertCircle, X, CheckCircle2 } from 'lucide-react'

interface ErrorAlertProps {
  message: string
  type?: 'error' | 'warning' | 'success'
  onClose?: () => void
  details?: string[]
}

export function ErrorAlert({ message, type = 'error', onClose, details }: ErrorAlertProps) {
  const bgColor = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    success: 'bg-green-50 border-green-200',
  }

  const textColor = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    success: 'text-green-800',
  }

  const iconColor = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
  }

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle

  return (
    <div className={`rounded-lg border-l-4 ${bgColor[type]} p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor[type]}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${textColor[type]}`}>{message}</p>
          {details && details.length > 0 && (
            <ul className={`mt-2 space-y-1 text-sm ${textColor[type]} opacity-90`}>
              {details.map((detail, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`shrink-0 opacity-60 hover:opacity-100 transition-opacity ${textColor[type]}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
