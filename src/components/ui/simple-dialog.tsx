"use client"

import React, { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimpleDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface SimpleDialogContentProps {
  className?: string
  children: React.ReactNode
  onClose?: () => void
}

interface SimpleDialogHeaderProps {
  className?: string
  children: React.ReactNode
}

interface SimpleDialogTitleProps {
  className?: string
  children: React.ReactNode
}

interface SimpleDialogDescriptionProps {
  className?: string
  children: React.ReactNode
}

function SimpleDialog({ open, onOpenChange, children }: SimpleDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onOpenChange) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

  if (!open) return null

  return <>{children}</>
}

function SimpleDialogContent({ className, children, onClose }: SimpleDialogContentProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto",
          "bg-background border rounded-lg shadow-lg p-6",
          "mx-4",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

function SimpleDialogHeader({ className, children }: SimpleDialogHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left mb-4", className)}
    >
      {children}
    </div>
  )
}

function SimpleDialogTitle({ className, children }: SimpleDialogTitleProps) {
  return (
    <h2
      className={cn("text-lg leading-none font-semibold", className)}
    >
      {children}
    </h2>
  )
}

function SimpleDialogDescription({ className, children }: SimpleDialogDescriptionProps) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
    >
      {children}
    </p>
  )
}

export {
  SimpleDialog,
  SimpleDialogContent,
  SimpleDialogDescription,
  SimpleDialogHeader,
  SimpleDialogTitle,
}
