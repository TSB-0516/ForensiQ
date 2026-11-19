import { NavLink, useNavigate } from 'react-router-dom';

import {

  LayoutDashboard,

  Upload,

  User,

  LogOut,

  Shield,

  Menu,

  X,

  Archive,
  Briefcase,
  Users,
} from 'lucide-react';

import { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

import { NAV_ITEMS } from '@/utils/constants';

import { isAdminRole, cn } from '@/utils/helpers';

import { Button } from '@/components/ui/button';



const iconMap = {

  LayoutDashboard,

  Upload,

  User,
  Archive,
  Briefcase,
  Users,
};



export function Sidebar() {

  const { role, email, logout } = useAuth();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);



  const navItems = isAdminRole(role) ? NAV_ITEMS.admin : NAV_ITEMS.investigator;

  const roleLabel = isAdminRole(role) ? 'Administrator' : 'Investigator';



  const mainItems = navItems.filter((item) => item.section === 'main');

  const evidenceItems = navItems.filter((item) => item.section === 'evidence');



  const handleLogout = () => {

    logout();

    navigate('/login');

  };



  const renderNavItem = (item) => {

    const Icon = iconMap[item.icon];

    return (

      <NavLink

        key={item.path}

        to={item.path}

        onClick={() => setMobileOpen(false)}

        className={({ isActive }) =>

          cn(

            'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-all duration-200',

            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',

            isActive

              ? 'bg-accent/10 text-accent border-l-2 border-accent font-medium'

              : 'text-muted hover:bg-card hover:text-foreground border-l-2 border-transparent'

          )

        }

      >

        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />

        {item.label}

      </NavLink>

    );

  };



  const sidebarContent = (

    <>

      <div className="border-b border-border px-4 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent/10 ring-1 ring-accent/20">

            <Shield className="h-4 w-4 text-accent" aria-hidden="true" />

          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-foreground tracking-tight">UEIIP</p>

            <p className="truncate text-[10px] uppercase tracking-widest text-muted">

              Investigation Workstation

            </p>

          </div>

        </div>

      </div>



      <div className="border-b border-border px-4 py-4">

        <p className="text-[10px] font-medium uppercase tracking-widest text-muted">Operator</p>

        <p className="mt-1.5 truncate text-sm font-medium text-foreground" title={email}>{email}</p>

        <span className="mt-2 inline-block rounded-sm bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent ring-1 ring-accent/20">

          {roleLabel}

        </span>

      </div>



      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4" aria-label="Main navigation">

        <div>

          <p className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-widest text-muted">General</p>

          <div className="space-y-0.5">{mainItems.map(renderNavItem)}</div>

        </div>

        <div>

          <p className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-widest text-muted">Evidence</p>

          <div className="space-y-0.5">{evidenceItems.map(renderNavItem)}</div>

        </div>

      </nav>



      <div className="border-t border-border p-3">

        <Button

          variant="ghost"

          className="w-full justify-start gap-3 text-muted hover:text-danger hover:bg-danger/5"

          onClick={handleLogout}

        >

          <LogOut className="h-4 w-4" aria-hidden="true" />

          Logout

        </Button>

      </div>

    </>

  );



  return (

    <>

      <button

        type="button"

        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-sidebar text-foreground shadow-sm transition-colors hover:border-accent/30 lg:hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"

        onClick={() => setMobileOpen(!mobileOpen)}

        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}

        aria-expanded={mobileOpen}

      >

        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}

      </button>



      {mobileOpen && (

        <div

          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden animate-fade-in"

          onClick={() => setMobileOpen(false)}

          aria-hidden="true"

        />

      )}



      <aside

        className={cn(

          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar shadow-xl transition-transform duration-300 ease-out lg:static lg:w-60 lg:translate-x-0 lg:shadow-none',

          mobileOpen ? 'translate-x-0' : '-translate-x-full'

        )}

        aria-label="Sidebar"

      >

        {sidebarContent}

      </aside>

    </>

  );

}


