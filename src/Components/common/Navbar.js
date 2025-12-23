import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { 
    Settings,
  Notifications, 
  AccountCircle,
  Logout as LogoutIcon 
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user?.bargain_name || 'Dashboard'}
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.name}!
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <IconButton>
            <Notifications />
          </IconButton>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
            
            <IconButton onClick={handleMenu}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#2563eb' }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <AccountCircle className="mr-2" /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Settings className="mr-2" /> Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} className="text-red-600">
                <LogoutIcon className="mr-2" /> Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;