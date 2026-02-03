import { User } from 'lucide-react'

export default function ChatHeader({
  orderId,
  name,
}: {
  orderId?: string
  name?: string
}) {
  return (
    <div className="py-4 px-4 sm:px-7 border border-[#E6E6E6] bg-white rounded-2xl flex items-center gap-3">
      <div className="bg-gray-100 rounded-full p-2">
        <User className="h-6 w-6 sm:h-7 sm:w-7 text-gray-500" />
      </div>
      <div>
        <p className="font-light text-base tracking-wider sm:text-lg">{name}</p>
        {/* <span className="text-[12px]">{`{${orderId}}`}</span> */}
        <span className="text-[12px] text-gray-500">{orderId}</span>
      </div>
    </div>
  )
}
