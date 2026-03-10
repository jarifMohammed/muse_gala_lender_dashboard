'use client'

import { useState, ChangeEvent, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Paperclip, Loader2, Plus } from 'lucide-react'

interface Props {
  onSend: (text: string, file?: File) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (disabled || (!message.trim() && !file)) return

    onSend(message, file || undefined)
    setMessage('')
    setFile(null)
  }

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [message, disabled])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="p-3 sm:p-4 bg-white border-t md:border-t-0 md:bg-gray-50/30">
      <div className="flex items-center gap-2 sm:gap-4 max-w-5xl mx-auto">
        {/* Plus / File Upload */}
        <label
          className={`shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          <Plus className="h-5 w-5" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            disabled={disabled}
          />
        </label>

        {/* Message Input Container */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            placeholder={file ? `Attached: ${file.name}` : 'Type a message...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="rounded-full py-2.5 px-5 border-none w-full outline-none bg-gray-100 text-sm placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-1 focus:ring-[#54051d]/20"
            disabled={disabled}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hidden sm:block">
            <Paperclip className="h-4 w-4" />
          </button>
        </div>

        {/* Send Button */}
        <Button
          type="button"
          onClick={handleSend}
          size="icon"
          disabled={disabled || (!message.trim() && !file)}
          className="rounded-full h-10 w-10 bg-[#54051d] hover:bg-[#54051d]/90 text-white shadow-md shadow-[#54051d]/20 transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          {disabled ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-4 w-4 fill-white" />
          )}
        </Button>
      </div>

      {/* File preview */}
      {file && (
        <div className="mt-2 text-xs text-gray-500">
          Attached: {file.name}
          <button
            onClick={() => setFile(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
