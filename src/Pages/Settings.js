import React, { useState } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Avatar,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  Save,
  Business,
  Person,
  Lock,
  Settings as SettingsIcon,
  AttachMoney,
  PhotoCamera,
  Info,
  Edit,
} from '@mui/icons-material';
import { useAuth } from '../Context/AuthContext';

const Settings = () => {
  const { user, isSuperAdmin } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Bargain Profile Settings
  const [bargainProfile, setBargainProfile] = useState({
    name: user?.bargain_name || 'ABC Motors',
    address: 'House #123, Satellite Town, Rawalpindi',
    city: 'Rawalpindi',
    phone: '0300-1234567',
    email: 'manager@bargain.com',
    description: 'Premium vehicle dealership specializing in quality cars',
    logo: null,
  });

  // Manager Profile Settings
  const [managerProfile, setManagerProfile] = useState({
    name: user?.name || 'Manager Name',
    email: user?.email || 'manager@example.com',
    phone: '0300-1234567',
    cnic: '35202-1234567-8',
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Commission Settings (Read-only for manager, can request changes)
  const [commissionSettings, setCommissionSettings] = useState({
    purchase_type: 'percentage',
    purchase_value: 5,
    sale_type: 'percentage',
    sale_value: 7,
  });

  // Handle Bargain Profile Save
  const handleBargainSave = () => {
    // API call to update bargain profile
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle Manager Profile Save
  const handleManagerSave = () => {
    // API call to update manager profile
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
  };

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBargainProfile({...bargainProfile, logo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate sample commission
  const calculateSampleCommission = (amount, type, value) => {
    if (type === 'percentage') {
      return (amount * value) / 100;
    }
    return value;
  };

  const sampleAmount = 2500000;
  const samplePurchaseCommission = calculateSampleCommission(
    sampleAmount,
    commissionSettings.purchase_type,
    commissionSettings.purchase_value
  );
  const sampleSaleCommission = calculateSampleCommission(
    sampleAmount,
    commissionSettings.sale_type,
    commissionSettings.sale_value
  );

  // Bargain Profile Tab
  const BargainProfileTab = () => (
    <div className="space-y-6">
      {showSuccess && (
        <Alert severity="success">Settings updated successfully!</Alert>
      )}

      {/* Logo Upload */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Business /> Bargain Logo
          </h3>
          <div className="flex items-center gap-6">
            <Avatar
              src={bargainProfile.logo}
              sx={{ width: 120, height: 120 }}
              variant="rounded"
            >
              <Business sx={{ fontSize: 60 }} />
            </Avatar>
            <div>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="logo-upload"
                type="file"
                onChange={handleLogoUpload}
              />
              <label htmlFor="logo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload Logo
                </Button>
              </label>
              <p className="text-sm text-gray-600 mt-2">
                Recommended: 500x500px, Max 2MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bargain Details */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Business /> Bargain Details
          </h3>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Bargain Name"
                value={bargainProfile.name}
                onChange={(e) => setBargainProfile({...bargainProfile, name: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Contact Phone"
                value={bargainProfile.phone}
                onChange={(e) => setBargainProfile({...bargainProfile, phone: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      📞
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email Address"
                type="email"
                value={bargainProfile.email}
                onChange={(e) => setBargainProfile({...bargainProfile, email: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      📧
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                value={bargainProfile.city}
                onChange={(e) => setBargainProfile({...bargainProfile, city: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      🏙️
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Complete Address"
                value={bargainProfile.address}
                onChange={(e) => setBargainProfile({...bargainProfile, address: e.target.value})}
                fullWidth
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      📍
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                value={bargainProfile.description}
                onChange={(e) => setBargainProfile({...bargainProfile, description: e.target.value})}
                fullWidth
                multiline
                rows={3}
                helperText="Brief description about your bargain"
              />
            </Grid>
          </Grid>

          <div className="flex justify-end mt-6">
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleBargainSave}
              style={{ backgroundColor: '#2563eb' }}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Manager Profile Tab
  const ManagerProfileTab = () => (
    <div className="space-y-6">
      {showSuccess && (
        <Alert severity="success">Profile updated successfully!</Alert>
      )}

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Person /> Manager Profile
          </h3>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                value={managerProfile.name}
                onChange={(e) => setManagerProfile({...managerProfile, name: e.target.value})}
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
                label="Email"
                type="email"
                value={managerProfile.email}
                onChange={(e) => setManagerProfile({...managerProfile, email: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      📧
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                value={managerProfile.phone}
                onChange={(e) => setManagerProfile({...managerProfile, phone: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      📞
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="CNIC"
                value={managerProfile.cnic}
                onChange={(e) => setManagerProfile({...managerProfile, cnic: e.target.value})}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      🆔
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <div className="flex justify-end mt-6">
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleManagerSave}
              style={{ backgroundColor: '#2563eb' }}
            >
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Password Change Tab
  const PasswordChangeTab = () => (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock /> Change Password
          </h3>

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

          <div className="flex justify-end mt-6">
            <Button
              variant="contained"
              startIcon={<Lock />}
              onClick={handlePasswordChange}
              style={{ backgroundColor: '#2563eb' }}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Commission Settings Tab
  const CommissionSettingsTab = () => (
    <div className="space-y-6">
      <Alert severity="info" icon={<Info />}>
        Commission rates are set by the system administrator. To request changes, please contact support.
      </Alert>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AttachMoney /> Current Commission Rates
          </h3>

          <Grid container spacing={4}>
            {/* Purchase Commission */}
            <Grid item xs={12} md={6}>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AttachMoney className="text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Purchase Commission</h4>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-800">
                      {commissionSettings.purchase_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rate:</span>
                    <span className="font-semibold text-blue-600 text-lg">
                      {commissionSettings.purchase_type === 'percentage' 
                        ? `${commissionSettings.purchase_value}%`
                        : `PKR ${commissionSettings.purchase_value.toLocaleString()}`
                      }
                    </span>
                  </div>
                </div>

                <Divider className="my-3" />

                <div className="bg-white p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Example on PKR 2,500,000:</p>
                  <p className="font-semibold text-blue-700">
                    Commission: PKR {samplePurchaseCommission.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    Net Amount: PKR {(sampleAmount - samplePurchaseCommission).toLocaleString()}
                  </p>
                </div>
              </div>
            </Grid>

            {/* Sale Commission */}
            <Grid item xs={12} md={6}>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AttachMoney className="text-green-600" />
                  <h4 className="font-semibold text-green-800">Sale Commission</h4>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-800">
                      {commissionSettings.sale_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rate:</span>
                    <span className="font-semibold text-green-600 text-lg">
                      {commissionSettings.sale_type === 'percentage' 
                        ? `${commissionSettings.sale_value}%`
                        : `PKR ${commissionSettings.sale_value.toLocaleString()}`
                      }
                    </span>
                  </div>
                </div>

                <Divider className="my-3" />

                <div className="bg-white p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Example on PKR 2,500,000:</p>
                  <p className="font-semibold text-green-700">
                    Commission: PKR {sampleSaleCommission.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    Net Amount: PKR {(sampleAmount - sampleSaleCommission).toLocaleString()}
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>

          <div className="mt-6">
            <Button
              variant="outlined"
              startIcon={<Edit />}
            >
              Request Commission Change
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your bargain and profile settings</p>
      </div>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
         <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
  <Tab label="Bargain Profile" icon={<Business />} iconPosition="start" />
  <Tab label="Commission Settings" icon={<AttachMoney />} iconPosition="start" />
</Tabs>

        </Box>

        <CardContent className="p-6">
         {tabValue === 0 && <BargainProfileTab />}
         {tabValue === 1 && <CommissionSettingsTab />}   
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Settings;