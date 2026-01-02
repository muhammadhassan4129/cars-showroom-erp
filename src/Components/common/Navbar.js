import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { IconButton, Menu, MenuItem, Avatar, Divider, ListItemIcon } from '@mui/material';
import { 
  Notifications, 
  AccountCircle,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleClose();
    navigate('/settings');
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
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: 200,
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                  },
                },
              }}
            >
              {/* User Info Header */}
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Profile */}
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                My Profile
              </MenuItem>

              {/* Settings */}
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>

              <Divider />

              {/* Logout */}
              <MenuItem onClick={handleLogout} className="text-red-600">
                <ListItemIcon>
                  <LogoutIcon fontSize="small" className="text-red-600" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;