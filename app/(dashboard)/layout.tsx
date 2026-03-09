import { auth } from '@/auth'
import { TooltipProvider } from '@/components/ui/tooltip'
import { redirect } from 'next/navigation'
// import '../globals.css'
import Sidebar from './_components/sidebar'
import Topbar from './_components/top-bar'
import ClientProvider from '@/components/Providers/clientProvider'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cu = await auth()

  if (!cu?.user) redirect('/sign-in')

  return (
    <div className="flex min-h-screen flex-col w-full max-w-full overflow-x-hidden overflow-y-auto selection:bg-primary/20 scrollbar-hide">
      <Sidebar />
      {/* Main Content */}
      <div className="lg:ml-64 flex flex-1 flex-col w-full max-w-full overflow-x-hidden overflow-y-auto scrollbar-hide">
        {/* Top Bar */}
        <ClientProvider session={cu} />
        <Topbar name={cu?.user.firstName as string} />

        <TooltipProvider>{children}</TooltipProvider>

        {/* Footer */}
        {/* <DashboardFooter /> */}
      </div>
    </div>
  )
}
