import { Sidebar } from './Sidebar';



export function AppLayout({ children, title, subtitle }) {

  return (

    <div className="flex min-h-screen bg-background">

      <Sidebar />

      <main className="flex-1 overflow-auto scrollbar-thin" id="main-content">

        <header className="sticky top-0 z-30 border-b border-border bg-sidebar/80 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8 lg:py-5">

          <div className="lg:pl-0 pl-10">

            {title && (

              <h1 className="text-base font-semibold text-foreground sm:text-lg tracking-tight">{title}</h1>

            )}

            {subtitle && (

              <p className="mt-0.5 text-xs text-muted leading-relaxed max-w-2xl">{subtitle}</p>

            )}

          </div>

        </header>

        <div className="animate-slide-in p-4 sm:p-6 lg:p-8">

          {children}

        </div>

      </main>

    </div>

  );

}


