'use client'

import { useMemo, useState } from 'react'
import { useSendMessage } from '@/hooks/useSendMessage'
import { useUserStore } from '@/zustand/useUserStore'
import { useSession } from 'next-auth/react'
import ChatInput from './chatInput'
import ChatMessages from './chatMessages'
import ChatHeader from './chatHeader'
import ChatList from './chatList'

interface Attachment {
  url: string
  type: string
  fileName: string
  size: number
  mimeType: string
}

interface ChatLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversations: any[]
  activeConversation: string
  onSelect: (id: string) => void
  messages: {
    _id: string
    message: string
    sender: {
      _id: string
      firstName: string
      role?: 'USER' | 'LENDER'
    }
    attachments: Attachment[]
    createdAt: string
  }[]
  isLoading?: boolean
  isConnected?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export default function ChatLayout({
  conversations,
  activeConversation,
  onSelect,
  messages,
  isLoading = false,
  isConnected = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}: ChatLayoutProps) {
  const { mutate: sendMessage, isPending: isSending } = useSendMessage()
  const { data: session } = useSession()
  const { user } = useUserStore()
  const [localLoading, setLocalLoading] = useState(false)

  // ✅ Get current user ID
  const currentUserId = user?.id || session?.user?.id

  // ✅ Get active conversation object
  const activeConv = conversations.find(c => c.id === activeConversation)
  const isClosed = activeConv?.status === 'closed'
  // const isFlagged = activeConv?.flagged?.status === true

  console.log('active conversations', activeConv)

  // 🔄 Handle conversation switch with loading state
  const handleSelectConversation = async (id: string) => {
    setLocalLoading(true)
    await onSelect(id)
    setTimeout(() => setLocalLoading(false), 300)
  }

  // 🧠 Optimized message formatting
  const formattedMessages = useMemo(() => {
    if (!currentUserId || !messages.length) return []
    return messages.map(m => ({
      id: m._id,
      content: m.message,
      sender: m.sender._id === currentUserId,
      timestamp: m.createdAt,
      rawSenderId: m.sender._id,
      attachments: m.attachments,
    }))
  }, [messages, currentUserId])

  // 📨 Message sending
  const handleSendMessage = async (text: string, file?: File) => {
    if (!activeConversation || (!text.trim() && !file)) return

    sendMessage({
      text: text.trim(),
      chatRoom: activeConversation,
      file,
    })
  }

  // ⏳ Loading state for user data
  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans px-4 sm:px-6 md:px-8">
      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
          Connecting to chat...
        </div>
      )}

      <div className="flex flex-col md:flex-row md:h-[500px] lg:h-[650px] gap-6 rounded-lg overflow-hidden">
        {/* ✅ Sidebar */}
        <ChatList
          conversations={conversations}
          activeConversation={activeConversation}
          onSelect={handleSelectConversation}
        />

        {/* ✅ Main Chat Window */}
        <div className="w-full md:w-2/3 flex flex-col">
          <ChatHeader
            name={activeConv?.name}
            orderId={activeConv?.orderId?.dressName}
          />

          <div className="flex-1 flex flex-col border border-[#E6E6E6] mt-5 rounded-xl overflow-hidden bg-white">
            {/* ✅ Messages */}
            {(isLoading || localLoading) && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-500">
                  Loading messages...
                </span>
              </div>
            )}

            <ChatMessages
              messages={formattedMessages}
              currentUserId={currentUserId}
              chatRoomId={activeConversation}
              isLoading={isLoading || localLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />

            {/* ✅ Closed or Flagged Conversation Logic */}
            <div className="border-t">
              {isClosed ? (
                <div className="flex items-center justify-center py-4 text-gray-500 text-sm">
                  This conversation has been closed.
                </div>
              ) : (
                <ChatInput
                  onSend={handleSendMessage}
                  disabled={isSending || !isConnected}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
