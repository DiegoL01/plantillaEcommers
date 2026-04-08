'use client'

import { useCallback } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { addToast, removeToast, type ToastType } from '@/lib/features/toastSlice'

export const useToast = () => {
  const dispatch = useAppDispatch()

  const show = useCallback(
    (message: string, type: ToastType, duration?: number) => {
      dispatch(addToast({ message, type, duration }))
    },
    [dispatch]
  )

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      show(message, 'success', duration)
    },
    [show]
  )

  const showError = useCallback(
    (message: string, duration?: number) => {
      show(message, 'error', duration)
    },
    [show]
  )

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      show(message, 'info', duration)
    },
    [show]
  )

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      show(message, 'warning', duration)
    },
    [show]
  )

  const dismiss = useCallback(
    (id: string) => {
      dispatch(removeToast(id))
    },
    [dispatch]
  )

  return {
    show,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    dismiss,
  }
}
