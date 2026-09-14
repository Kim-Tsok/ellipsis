'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Inbox,
  LogOut,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  SquarePen,
  UserRound,
  Zap,
} from 'lucide-react';

import { BrandLogo } from '@/components/brand/BrandLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth/auth-client';
import { AUTH_ROUTES } from '@/lib/auth/constants/auth';

const NAV_ITEMS = [
  {
    name: 'Graph',
    href: '/app',
    icon: Sparkles,
    description: 'Your connected thoughts',
  },
  {
    name: 'Pings',
    href: '/app/pings',
    icon: Zap,
    description: 'Quick captures',
  },
  {
    name: 'Notes',
    href: '/app/notes',
    icon: SquarePen,
    description: 'Write and organize',
  },
  {
    name: 'Digest',
    href: '/app/digest',
    icon: Inbox,
    description: 'Your daily overview',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('ellipsis-sidebar-collapsed');

    if (saved === 'true') {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      'ellipsis-sidebar-collapsed',
      String(collapsed)
    );
  }, [collapsed]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === '/app';
    }

    return pathname.startsWith(href);
  };

  const user = session?.user;
  const displayName =
    user?.name?.trim() || user?.email?.split('@')[0] || 'Account';
  const email = user?.email || '';
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.replace(AUTH_ROUTES.LOGIN),
        },
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={[
          'relative z-30 hidden h-screen shrink-0 flex-col',
          'md:flex',
          'transition-[width] duration-300 ease-out',
          collapsed ? 'w-[76px]' : 'w-[248px]',
        ].join(' ')}
      >
        {/* Brand */}
        <div
          className={[
            'flex h-[76px] shrink-0 items-center',
            collapsed ? 'justify-center px-3' : 'px-5',
          ].join(' ')}
        >
          {collapsed ? (
            <Link
              href="/app"
              aria-label="Ellipsis home"
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-black/[0.04]"
            >
              <BrandLogo variant="mark" className="h-7 w-7 text-[#151515]" />
            </Link>
          ) : (
            <Link
              href="/app"
              className="flex items-center rounded-xl px-1 py-2"
            >
              <BrandLogo variant="full" className="h-7 w-auto text-[#151515]" />
            </Link>
          )}
        </div>

        {/* Search */}
        <div className={collapsed ? 'px-3' : 'px-4'}>
          <button
            type="button"
            className={[
              'group flex h-10 w-full items-center rounded-xl',
              'border border-black/[0.06] bg-white/20',
              'text-[#7a8587] transition-all',
              'hover:border-[#4FA1AF]/30 hover:bg-white/40',
              collapsed ? 'justify-center' : 'gap-3 px-3',
            ].join(' ')}
            title={collapsed ? 'Search' : undefined}
          >
            <Search
              size={17}
              strokeWidth={1.7}
              className="shrink-0 transition-colors group-hover:text-[#4FA1AF]"
            />

            {!collapsed && (
              <>
                <span className="flex-1 text-left font-sans text-[13px]">
                  Search
                </span>

                <kbd className="hidden rounded-md border border-black/[0.06] bg-[#f7f7f7]/10 px-1.5 py-0.5 font-sans text-[10px] text-[#9a9a9a]/80 lg:block">
                  /
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Primary Navigation */}
        <nav
          aria-label="Main navigation"
          className={[
            'mt-7 flex flex-1 flex-col',
            collapsed ? 'px-3' : 'px-4',
          ].join(' ')}
        >
          {!collapsed && (
            <div className="mb-2 px-2">
              <span className="font-sans text-[10px] font-medium tracking-[0.16em] text-[#9ca6a7] uppercase">
                Workspace
              </span>
            </div>
          )}

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  title={collapsed ? item.name : undefined}
                  className={[
                    'group relative flex h-11 items-center rounded-xl',
                    'transition-all duration-200',
                    collapsed ? 'justify-center' : 'gap-3 px-3',
                    active
                      ? 'bg-[#dff2f4]/20 text-[#182326]'
                      : 'text-[#657072] hover:bg-black/[0.035] hover:text-[#20282a]',
                  ].join(' ')}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-[#4FA1AF]" />
                  )}

                  <Icon
                    size={19}
                    strokeWidth={active ? 1.8 : 1.5}
                    className={[
                      'shrink-0 transition-colors',
                      active
                        ? 'text-[#388d9c]'
                        : 'text-[#899395] group-hover:text-[#4FA1AF]',
                    ].join(' ')}
                  />

                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <div
                        className={[
                          'font-instrument-serif text-[18px] leading-none',
                          active ? 'text-[#182326]' : 'text-[#41494b]',
                        ].join(' ')}
                      >
                        {item.name}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Secondary */}
          <div className="mt-8">
            {!collapsed && (
              <div className="mb-2 px-2">
                <span className="font-sans text-[10px] font-medium tracking-[0.16em] text-[#9ca6a7] uppercase">
                  Manage
                </span>
              </div>
            )}

            <Link
              href="/app/settings"
              title={collapsed ? 'Settings' : undefined}
              className={[
                'group flex h-11 items-center rounded-xl text-[#657072]',
                'transition-colors hover:bg-black/[0.035] hover:text-[#20282a]',
                collapsed ? 'justify-center' : 'gap-3 px-3',
                pathname.startsWith('/app/settings')
                  ? 'bg-[#dff2f4] text-[#182326]'
                  : '',
              ].join(' ')}
            >
              <Settings
                size={19}
                strokeWidth={1.5}
                className="shrink-0 text-[#899395] transition-colors group-hover:text-[#4FA1AF]"
              />

              {!collapsed && (
                <span className="font-instrument-serif text-[18px]">
                  Settings
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Collapse Button */}
        <div className={collapsed ? 'px-3' : 'px-4'}>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className={[
              'mb-2 flex h-9 w-full items-center rounded-lg',
              'text-[#929b9d] transition-colors',
              'hover:bg-black/[0.035] hover:text-[#3d484a]',
              collapsed ? 'justify-center' : 'gap-3 px-3',
            ].join(' ')}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight size={17} strokeWidth={1.5} />
            ) : (
              <>
                <ChevronLeft size={17} strokeWidth={1.5} />
                <span className="font-sans text-[11px]">Collapse sidebar</span>
              </>
            )}
          </button>
        </div>

        {/* Profile */}
        <div
          ref={profileRef}
          className={[
            'relative border-t border-black/[0.06]',
            collapsed ? 'p-3' : 'p-4',
          ].join(' ')}
        >
          {profileOpen && (
            <div
              className={[
                'absolute bottom-[calc(100%+8px)] z-50',
                'overflow-hidden rounded-2xl border border-black/[0.07]',
                'bg-white/95 shadow-[0_16px_50px_rgba(30,60,65,0.14)] backdrop-blur-xl',
                'animate-in fade-in slide-in-from-bottom-2 duration-150',
                collapsed ? 'left-2 w-60' : 'right-4 left-4',
              ].join(' ')}
            >
              <div className="border-b border-black/[0.06] px-4 py-3">
                <p className="font-instrument-serif text-[17px] text-[#202627]">
                  {displayName}
                </p>

                <p className="mt-0.5 truncate font-sans text-[11px] text-[#8a9495]">
                  {email}
                </p>
              </div>

              <div className="p-1.5">
                <Link
                  href="/app/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex h-10 items-center gap-3 rounded-xl px-3 font-sans text-[13px] text-[#596466] transition-colors hover:bg-[#eef8f9] hover:text-[#1f777f]"
                >
                  <UserRound size={16} strokeWidth={1.5} />
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex h-10 w-full items-center gap-3 rounded-xl px-3 font-sans text-[13px] text-[#8a5555] transition-colors hover:bg-[#fff5f5]"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  {isSigningOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setProfileOpen((value) => !value)}
            aria-expanded={profileOpen}
            className={[
              'group flex w-full items-center rounded-xl',
              'transition-colors hover:bg-black/[0.035]',
              collapsed ? 'justify-center p-1.5' : 'gap-3 px-2 py-2',
            ].join(' ')}
          >
            {/* Avatar */}
            <Avatar className="h-9 w-9 shrink-0 border border-[#4FA1AF]/20 bg-[#dff2f4]">
              <AvatarImage src={user?.image || undefined} alt="" />
              <AvatarFallback className="bg-[#dff2f4] font-sans text-[11px] font-medium text-[#438d98]">
                {isSessionLoading ? (
                  <CircleUserRound size={19} strokeWidth={1.4} />
                ) : (
                  initials
                )}
              </AvatarFallback>
            </Avatar>

            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate font-sans text-[12px] font-medium text-[#374143]">
                    {displayName}
                  </p>

                  <p className="truncate font-sans text-[10px] text-[#929b9d]">
                    {email}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  strokeWidth={1.5}
                  className={[
                    'shrink-0 text-[#929b9d] transition-transform',
                    profileOpen ? 'rotate-180' : '',
                  ].join(' ')}
                />
              </>
            )}

            {collapsed && (
              <span className="absolute left-full ml-3 hidden rounded-lg bg-[#202627] px-2.5 py-1.5 font-sans text-[11px] whitespace-nowrap text-white shadow-lg group-hover:block">
                Account
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-3 bottom-3 z-50 flex h-[62px] items-center justify-around rounded-2xl border border-black/[0.06] bg-white/90 px-2 shadow-[0_10px_40px_rgba(30,60,65,0.12)] backdrop-blur-xl md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={[
                'flex h-12 min-w-[70px] flex-col items-center justify-center gap-1 rounded-xl',
                active ? 'bg-[#dff2f4] text-[#398b98]' : 'text-[#8a9495]',
              ].join(' ')}
            >
              <Icon size={18} strokeWidth={1.6} />

              <span className="font-sans text-[9px]">{item.name}</span>
            </Link>
          );
        })}

        <Link
          href="/app/settings"
          className="flex h-12 min-w-[70px] flex-col items-center justify-center gap-1 rounded-xl text-[#8a9495]"
        >
          <Settings size={18} strokeWidth={1.6} />

          <span className="font-sans text-[9px]">Settings</span>
        </Link>
      </nav>
    </>
  );
}
