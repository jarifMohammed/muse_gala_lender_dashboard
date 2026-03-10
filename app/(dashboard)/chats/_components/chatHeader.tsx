import { User, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ChatHeader({
  orderId,
  name,
  onBack,
}: {
  orderId?: string
  name?: string
  onBack?: () => void
}) {
  return (
    <div className="py-2.5 px-3 sm:py-4 sm:px-7 border-b border-[#E6E6E6] bg-white flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 -ml-1 text-[#54051d]"
            onClick={onBack}
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5px]" />
          </Button>
        )}
        <div className="relative shrink-0">
          <div className="bg-gray-100 rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center overflow-hidden">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          </div>
        </div>
        <div className="min-w-0 flex flex-col">
          <p className="font-bold text-sm sm:text-base tracking-tight truncate text-gray-900 leading-tight">
            {name}
          </p>
        </div>
      </div>
    </div>
  )
}
