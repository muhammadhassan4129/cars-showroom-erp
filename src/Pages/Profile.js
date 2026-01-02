import React, { useState } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Avatar,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Save,
  Person,
  PhotoCamera,
  Lock,
  Email,
  Phone,
  CreditCard,
} from '@mui/icons-material';
import { useAuth } from '../Context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  // Profile Data
  const [profile, setProfile] = useState({
    name: user?.name || 'Manager Name',
    email: user?.email || 'manager@example.com',
    phone: '0300-1234567',
    cnic: '35202-1234567-8',
    address: 'House #123, Satellite Town, Rawalpindi',
    city: 'Rawalpindi',
    profile_picture: null,
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Handle Profile Save
  const handleProfileSave = () => {
    // API call to update profile
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle Password Change
  const handlePasswordChange = () => {
    setPasswordError('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    // API call to change password
    alert('Password changed successfully!');
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    setShowPasswordSection(false);
  };

  // Handle Profile Picture Upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({...profile, profile_picture: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and password</p>
      </div>

      {showSuccess && (
        <Alert severity="success" className="mb-6">
          Profile updated successfully!
        </Alert>
      )}

      {/* Profile Picture Section */}
      <Card className="mb-6">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Person /> Profile Picture
          </h3>
          <div className="flex items-center gap-6">
            <Avatar
              src={profile.profile_picture}
              sx={{ width: 150, height: 150 }}
            >
              <Person sx={{ fontSize: 80 }} />
            </Avatar>
            <div>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                type="file"
                onChange={handleProfilePictureUpload}
              />
              <label htmlFor="profile-picture-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Change Picture
                </Button>
              </label>
              <p className="text-sm text-gray-600 mt-2">
                Recommended: Square image, Max 2MB
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Person /> Personal Information
          </h3>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="CNIC"
                value={profile.cnic}
                onChange={(e) => setProfile({...profile, cnic: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCard />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                value={profile.city}
                onChange={(e) => setProfile({...profile, city: e.target.value})}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Complete Address"
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                fullWidth
              />
            </Grid>
          </Grid>

          <div className="flex justify-end mt-6">
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleProfileSave}
              style={{ backgroundColor: '#2563eb' }}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lock /> Password & Security
            </h3>
            {!showPasswordSection && (
              <Button
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setShowPasswordSection(true)}
              >
                Change Password
              </Button>
            )}
          </div>

          {!showPasswordSection ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                Last password change: <span className="font-semibold">30 days ago</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                It's recommended to change your password every 90 days for security.
              </p>
            </div>
          ) : (
            <>
              {passwordError && (
                <Alert severity="error" className="mb-4">{passwordError}</Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="New Password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    fullWidth
                    helperText="Minimum 8 characters"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Alert severity="info" className="mt-4">
                <strong>Password Requirements:</strong>
                <ul className="list-disc ml-5 mt-2">
                  <li>At least 8 characters long</li>
                  <li>Mix of uppercase and lowercase letters (recommended)</li>
                  <li>Include numbers and special characters (recommended)</li>
                </ul>
              </Alert>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordError('');
                    setPasswordData({
                      current_password: '',
                      new_password: '',
                      confirm_password: '',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Lock />}
                  onClick={handlePasswordChange}
                  style={{ backgroundColor: '#2563eb' }}
                >
                  Update Password
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Profile;