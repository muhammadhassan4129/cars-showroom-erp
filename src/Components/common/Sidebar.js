import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import {
  Dashboard as DashboardIcon,
  DirectionsCar,
  People,
  ShoppingCart,
  Sell,
  Payment,
  Assessment,
  Business,
  Settings,
  Subscriptions,
} from '@mui/icons-material';

const Sidebar = () => {
  const { user, isSuperAdmin, isManager } = useAuth();
  const location = useLocation();

  const menuItems = [
    // Common for all
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['super_admin', 'manager']
    },
    
    // Super Admin Only
    {
      title: 'Manage Bargains',
      icon: <Business />,
      path: '/bargains',
      roles: ['super_admin']
    },
    {
      title: 'Commission Settings',
      icon: <Settings />,
      path: '/commission',
      roles: ['super_admin']
    },
    {
      title: 'Subscriptions',
      icon: <Subscriptions />,
      path: '/subscriptions',
      roles: ['super_admin']
    },
    
    // Manager Only
    {
      title: 'Customers',
      icon: <People />,
      path: '/customers',
      roles: ['manager']
    },
    {
      title: 'Vehicles',
      icon: <DirectionsCar />,
      path: '/vehicles',
      roles: ['manager']
    },
    {
      title: 'Purchases',
      icon: <ShoppingCart />,
      path: '/purchases',
      roles: ['manager']
    },
    {
      title: 'Sales',
      icon: <Sell />,
      path: '/sales',
      roles: ['manager']
    },
    {
      title: 'Installments',
      icon: <Payment />,
      path: '/installments',
      roles: ['manager']
    },
    
    // Common Reports
    {
      title: 'Reports',
      icon: <Assessment />,
      path: '/reports',
      roles: ['super_admin', 'manager']
    },
  ];

  const filteredMenu = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white fixed left-0 top-0 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <DirectionsCar />
          </div>
          <div>
            <h2 className="font-bold text-lg">Bargain ERP</h2>
            <p className="text-xs text-gray-400">
              {isSuperAdmin() ? 'Super Admin' : 'Manager'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {filteredMenu.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info at Bottom */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-sm">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;