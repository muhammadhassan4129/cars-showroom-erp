import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import {
  Card, CardContent, TextField, Button, Grid, Divider, Alert,
  Avatar, InputAdornment, Tabs, Tab, Box, CircularProgress
} from '@mui/material';
import { Save, Business, AttachMoney, PhotoCamera, Info } from '@mui/icons-material';
import { useAuth } from '../Context/AuthContext';
import api from '../Services/api';

const Settings = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [bargainProfile, setBargainProfile] = useState({
    name: '',
    bargain_email: '',
    phone: '',
    address: '',
    logo: null,
    logoPreview: null
  });

  const [commissionSettings, setCommissionSettings] = useState({
    purchase_commission_type: 'percentage',
    purchase_commission_rate: 0,
    sale_commission_type: 'percentage',
    sale_commission_rate: 0,
  });

  // Fetch Current Data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetching(true);
        // Correct Manager Endpoint
        const response = await api.get('/my-bargain/settings'); 
        if (response.data.success) {
          const data = response.data.data;
          setBargainProfile({
            name: data.name || '',
            bargain_email: data.bargain_email || '',
            phone: data.phone || '',
            address: data.address || '',
            // Agar backend se full URL nahi aa rahi toh domain add karein
            logoPreview: data.logo ? `http://localhost:8000/storage/${data.logo}` : null,
            logo: null
          });

          setCommissionSettings({
            purchase_commission_type: data.purchase_commission_type,
            purchase_commission_rate: data.purchase_commission_rate,
            sale_commission_type: data.sale_commission_type,
            sale_commission_rate: data.sale_commission_rate,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBargainProfile({
        ...bargainProfile,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      });
    }
  };

  // Save Function Updated for Manager Route
  const handleBargainSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const formData = new FormData();
      formData.append('name', bargainProfile.name);
      formData.append('bargain_email', bargainProfile.bargain_email);
      formData.append('phone', bargainProfile.phone);
      formData.append('address', bargainProfile.address || '');
      
      if (bargainProfile.logo instanceof File) {
        formData.append('logo', bargainProfile.logo);
      }

      // Backend route is explicitly Route::post('/my-bargain/settings')
      // No need for _method spoofing or specific ID in URL
      const response = await api.post('/my-bargain/settings', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Bargain settings updated successfully!' });
      }
    } catch (error) {
      console.error("Full Error Object:", error.response);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        setMessage({ type: 'error', text: Object.values(errors)[0][0] });
      } else {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Update failed' 
        });
      }
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  if (fetching) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your business profile</p>
      </div>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Bargain Profile" icon={<Business />} iconPosition="start" />
            <Tab label="Commission Settings" icon={<AttachMoney />} iconPosition="start" />
          </Tabs>
        </Box>

        <CardContent className="p-6">
          {tabValue === 0 && (
            <div className="space-y-6">
              {message.text && <Alert severity={message.type} className="mb-4">{message.text}</Alert>}
              
              <div className="flex items-center gap-6 mb-4">
                <Avatar src={bargainProfile.logoPreview} sx={{ width: 100, height: 100 }} variant="rounded">
                  <Business sx={{ fontSize: 50 }} />
                </Avatar>
                <div>
                  <input accept="image/*" id="logo-up" type="file" hidden onChange={handleLogoChange} />
                  <label htmlFor="logo-up">
                    <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>Change Logo</Button>
                  </label>
                </div>
              </div>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField label="Bargain Name" fullWidth value={bargainProfile.name} onChange={(e) => setBargainProfile({...bargainProfile, name: e.target.value})} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Email" fullWidth value={bargainProfile.bargain_email} onChange={(e) => setBargainProfile({...bargainProfile, bargain_email: e.target.value})} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Phone" fullWidth value={bargainProfile.phone} onChange={(e) => setBargainProfile({...bargainProfile, phone: e.target.value})} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Address" fullWidth multiline rows={2} value={bargainProfile.address} onChange={(e) => setBargainProfile({...bargainProfile, address: e.target.value})} />
                </Grid>
              </Grid>

              <div className="flex justify-end mt-6">
                <Button variant="contained" onClick={handleBargainSave} disabled={loading} startIcon={loading && <CircularProgress size={20} color="inherit" />}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {tabValue === 1 && (
             <Grid container spacing={4}>
             <Grid item xs={12} md={6}>
               <div className="bg-blue-50 p-4 rounded-lg">
                 <h4 className="font-semibold text-blue-800 mb-2">Purchase Commission</h4>
                 <p className="text-2xl font-bold text-blue-600">
                   {commissionSettings.purchase_commission_rate}
                   {commissionSettings.purchase_commission_type === 'percentage' ? '%' : ' PKR'}
                 </p>
               </div>
             </Grid>
             <Grid item xs={12} md={6}>
               <div className="bg-green-50 p-4 rounded-lg">
                 <h4 className="font-semibold text-green-800 mb-2">Sale Commission</h4>
                 <p className="text-2xl font-bold text-green-600">
                   {commissionSettings.sale_commission_rate}
                   {commissionSettings.sale_commission_type === 'percentage' ? '%' : ' PKR'}
                 </p>
               </div>
             </Grid>
           </Grid>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Settings;