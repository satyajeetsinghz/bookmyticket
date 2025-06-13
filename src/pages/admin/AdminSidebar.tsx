import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, FilmIcon, UsersIcon, TicketIcon, CogIcon } from '@heroicons/react/24/outline';

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'Movies', path: '/admin/movies', icon: FilmIcon },
    { name: 'Users', path: '/admin/users', icon: UsersIcon },
    { name: 'Bookings', path: '/admin/bookings', icon: TicketIcon },
    { name: 'Settings', path: '/admin/settings', icon: CogIcon },
  ];

  return (
    <div className="w-64 h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          {/* Website logo  */}
          {/* <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg> */}
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <TicketIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">Admin</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-600/10 text-blue-500'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-500' : 'text-neutral-400'}`} />
                  {item.name}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer (optional) */}
      <div className="p-4 border-t border-neutral-800">
        <div className="text-xs text-neutral-500">
          <p>MoviePass Admin</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}