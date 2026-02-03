'use client'

import { Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  conversations: any[]
  activeConversation: string
  onSelect: (id: string) => void
}

export default function ChatList({
  conversations,
  activeConversation,
  onSelect,
}: Props) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // ✅ Debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // ✅ Highlight function
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(
      regex,
      `<span class="bg-yellow-200 font-semibold">$1</span>`
    )
  }

  // ✅ Filter conversations (name + timestamp + preview)
  const filteredConversations = useMemo(() => {
    if (!debouncedSearch.trim()) return conversations

    const lower = debouncedSearch.toLowerCase()

    return conversations.filter((c) => {
      return (
        c.name?.toLowerCase().includes(lower) ||
        c.timestamp?.toLowerCase().includes(lower) ||
        c.preview?.toLowerCase().includes(lower)
      )
    })
  }, [debouncedSearch, conversations])

  return (
    <div className="w-full md:w-1/3">
      {/* ✅ Search Field */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-[16px] h-5 w-5 text-[#595959]" />
          <Input
            placeholder="SEARCH MESSAGE....."
            className="pl-11 py-6 border-[#E6E6E6] bg-white focus-visible:ring-0 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ Conversations */}
      <div className="overflow-y-auto scrollbar-hide max-h-[400px] md:max-h-[544px]">
        {/* ✅ No Results Found */}
        {filteredConversations.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-sm tracking-wide">No results found for:</p>
            <p className="font-semibold mt-1 text-gray-700">
              {debouncedSearch}
            </p>
          </div>
        )}

        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 flex items-start gap-3 rounded-md cursor-pointer hover:bg-red-50 border-b ${
              activeConversation === conversation.id ? 'bg-red-100' : ''
            }`}
            onClick={() => onSelect(conversation.id)}
          >
            {/* Icon */}
            <div className="bg-red-300 rounded-full p-2 flex-shrink-0">
              <User className="h-5 w-5 text-pink-800" />
            </div>

            {/* Texts */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p
                  className="font-normal tracking-wide text-sm"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(conversation.name, debouncedSearch),
                  }}
                />

                <span className="text-xs text-gray-500">
                  {conversation.timestamp}
                </span>
              </div>

              <p
                className="text-sm text-gray-500 truncate pt-2"
                dangerouslySetInnerHTML={{
                  __html: highlightText(conversation.preview, debouncedSearch),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
