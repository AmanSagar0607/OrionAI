import { ReactNode } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { Home, BarChart, Users, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:block">
        <DashboardNav />
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex justify-around p-2">
          <a
            href="/dashboard"
            className="flex flex-col items-center p-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </a>
          <a
            href="/dashboard/analytics"
            className="flex flex-col items-center p-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <BarChart className="h-5 w-5" />
            <span>Analytics</span>
          </a>
          <a
            href="/dashboard/team"
            className="flex flex-col items-center p-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Users className="h-5 w-5" />
            <span>Team</span>
          </a>
          <a
            href="/dashboard/settings"
            className="flex flex-col items-center p-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
