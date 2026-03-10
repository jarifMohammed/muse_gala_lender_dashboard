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
    if (!query || !text) return String(text || '')
    try {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(${escapedQuery})`, 'gi')
      return String(text).replace(
        regex,
        `<span class="bg-yellow-200 font-semibold">$1</span>`
      )
    } catch (e) {
      return String(text)
    }
  }

  // ✅ Filter conversations (name + timestamp + preview)
  const filteredConversations = useMemo(() => {
    if (!debouncedSearch.trim()) return conversations

    const lower = debouncedSearch.toLowerCase()

    return conversations.filter((c) => {
      const lowerQuery = lower.trim()
      return (
        String(c.name || '').toLowerCase().includes(lowerQuery) ||
        String(c.email || '').toLowerCase().includes(lowerQuery) ||
        String(c.orderId || '').toLowerCase().includes(lowerQuery) ||
        String(c.timestamp || '').toLowerCase().includes(lowerQuery) ||
        String(c.preview || '').toLowerCase().includes(lowerQuery)
      )
    })
  }, [debouncedSearch, conversations])

  return (
    <div className="w-full md:w-1/3 flex flex-col h-full bg-white md:bg-transparent">
      {/* ✅ Search Field */}
      <div className="px-5 md:px-0 mt-2 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-10 h-11 md:h-12 border-none bg-gray-100 rounded-full focus-visible:ring-1 focus-visible:ring-blue-100 text-sm placeholder:text-gray-400 shadow-none outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {/* ✅ Conversations */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* ✅ No Results Found */}
        {filteredConversations.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-xs md:text-sm tracking-wide">No results found for:</p>
            <p className="font-semibold mt-1 text-gray-700 text-sm">
              {debouncedSearch}
            </p>
          </div>
        )}

        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors active:bg-gray-100 md:hover:bg-gray-50 ${activeConversation === conversation.id ? 'bg-blue-50 md:bg-red-50' : ''
              }`}
            onClick={() => onSelect(conversation.id)}
          >
            <div className="relative shrink-0">
              <div className="bg-gray-200 rounded-full w-12 h-12 md:w-12 md:h-12 flex items-center justify-center overflow-hidden">
                <User className="h-6 w-6 text-gray-500" />
              </div>
            </div>

            {/* Texts */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p
                  className="font-semibold text-sm md:text-md truncate text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(conversation.name, debouncedSearch),
                  }}
                />
                <span className="text-[10px] md:text-xs text-gray-400 shrink-0">
                  {conversation.timestamp}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2 mt-0.5">
                <p
                  className={`text-xs md:text-sm truncate flex-1 ${activeConversation === conversation.id ? 'text-gray-800' : 'text-gray-500'
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: highlightText(conversation.preview, debouncedSearch),
                  }}
                />
                {/* Unread indicator placeholder */}
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
              </div>

              {conversation.orderId && (
                <p
                  className="text-[9px] md:text-[10px] text-gray-400 mt-1 uppercase truncate"
                  dangerouslySetInnerHTML={{
                    __html: `ID: ${highlightText(
                      conversation.orderId,
                      debouncedSearch
                    )}`,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
