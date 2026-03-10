import React from 'react'
import ChatPage from './_components/chatpage'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const page = () => {
  return (
    <div className="p-0 md:p-10 md:pb-0">
      <div className="px-5 md:px-0 pt-4 md:pt-0">
        <Link
          href="/bookings"
          className="flex items-center text-sm font-medium text-gray-500 hover:text-[#54051d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Bookings
        </Link>
      </div>
      <ChatPage />
    </div>
  )
}

export default page
