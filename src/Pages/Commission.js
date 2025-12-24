import React, { useState } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  Divider,
  Chip,
} from '@mui/material';
import {
  Settings,
  Save,
  TrendingUp,
  ShoppingCart,
  Sell,
  AttachMoney,
  Info,
} from '@mui/icons-material';
import { dummyBargains, commissionSettings } from '../Utils/dummyData';

const Commission = () => {
  const [settings, setSettings] = useState(commissionSettings);
  const [selectedBargain, setSelectedBargain] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);

  // Bargain-specific commission settings (dummy data)
  const [bargainCommissions, setBargainCommissions] = useState([
    {
      bargain_id: 1,
      bargain_name: 'ABC Motors',
      purchase_type: 'percentage',
      purchase_value: 5,
      sale_type: 'percentage',
      sale_value: 7,
    },
    {
      bargain_id: 2,
      bargain_name: 'XYZ Auto Sales',
      purchase_type: 'percentage',
      purchase_value: 4.5,
      sale_type: 'percentage',
      sale_value: 6.5,
    },
    {
      bargain_id: 3,
      bargain_name: 'Prime Vehicles',
      purchase_type: 'fixed',
      purchase_value: 50000,
      sale_type: 'percentage',
      sale_value: 7,
    },
  ]);

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
    settings.purchase_type,
    settings.purchase_value
  );
  const sampleSaleCommission = calculateSampleCommission(
    sampleAmount,
    settings.sale_type,
    settings.sale_value
  );

  // Handle Save
  const handleSave = () => {
    // In real app, this would save to backend
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <DashboardLayout>

   {/* Commission Summary Stats */}
      <Grid container spacing={3} className="mt-6">
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Bargains</p>
                  <p className="text-2xl font-bold text-gray-800">{dummyBargains.length}</p>
                </div>
                <TrendingUp className="text-blue-600" fontSize="large" />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Custom Settings</p>
                  <p className="text-2xl font-bold text-orange-600">{bargainCommissions.length}</p>
                </div>
                <Settings className="text-orange-600" fontSize="large" />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Avg Purchase Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {((bargainCommissions.reduce((sum, bc) => 
                      sum + (bc.purchase_type === 'percentage' ? bc.purchase_value : 5), 0
                    ) + settings.purchase_value) / (bargainCommissions.length + 1)).toFixed(1)}%
                  </p>
                </div>
                <ShoppingCart className="text-blue-600" fontSize="large" />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Avg Sale Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {((bargainCommissions.reduce((sum, bc) => 
                      sum + (bc.sale_type === 'percentage' ? bc.sale_value : 7), 0
                    ) + settings.sale_value) / (bargainCommissions.length + 1)).toFixed(1)}%
                  </p>
                </div>
                <Sell className="text-green-600" fontSize="large" />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Commission Settings</h1>
        <p className="text-gray-600 mt-1">Configure commission rates for purchases and sales</p>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" className="mb-6">
          Commission settings updated successfully!
        </Alert>
      )}

      {/* Global Commission Settings */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Global Commission Settings</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            These settings apply to all bargains by default. You can override them for specific bargains below.
          </p>

          <Grid container spacing={4}>
            {/* Purchase Commission */}
            <Grid item xs={12} md={6}>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Purchase Commission</h3>
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Commission Type</InputLabel>
                      <Select
                        value={settings.purchase_type}
                        label="Commission Type"
                        onChange={(e) => setSettings({...settings, purchase_type: e.target.value})}
                      >
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                        <MenuItem value="fixed">Fixed Amount (PKR)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label={settings.purchase_type === 'percentage' ? 'Commission Rate (%)' : 'Fixed Amount'}
                      type="number"
                      value={settings.purchase_value}
                      onChange={(e) => setSettings({...settings, purchase_value: Number(e.target.value)})}
                      fullWidth
                      InputProps={{
                        startAdornment: settings.purchase_type === 'fixed' && (
                          <InputAdornment position="start">PKR</InputAdornment>
                        ),
                        endAdornment: settings.purchase_type === 'percentage' && (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Sample Calculation */}
                <div className="mt-4 p-3 bg-white rounded border border-blue-200">
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
                <div className="flex items-center gap-2 mb-4">
                  <Sell className="text-green-600" />
                  <h3 className="font-semibold text-green-800">Sale Commission</h3>
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Commission Type</InputLabel>
                      <Select
                        value={settings.sale_type}
                        label="Commission Type"
                        onChange={(e) => setSettings({...settings, sale_type: e.target.value})}
                      >
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                        <MenuItem value="fixed">Fixed Amount (PKR)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label={settings.sale_type === 'percentage' ? 'Commission Rate (%)' : 'Fixed Amount'}
                      type="number"
                      value={settings.sale_value}
                      onChange={(e) => setSettings({...settings, sale_value: Number(e.target.value)})}
                      fullWidth
                      InputProps={{
                        startAdornment: settings.sale_type === 'fixed' && (
                          <InputAdornment position="start">PKR</InputAdornment>
                        ),
                        endAdornment: settings.sale_type === 'percentage' && (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Sample Calculation */}
                <div className="mt-4 p-3 bg-white rounded border border-green-200">
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

          {/* Info Alert */}
          <Alert severity="info" icon={<Info />} className="mt-4">
            Commission is automatically deducted from the transaction amount. For purchases, commission is deducted from what you pay to the seller. For sales, commission is deducted from what the buyer pays you.
          </Alert>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSave}
              style={{ backgroundColor: '#2563eb' }}
            >
              Save Global Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bargain-Specific Commission */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Bargain-Specific Commission</h2>
              <p className="text-sm text-gray-600 mt-1">Override global settings for individual bargains</p>
            </div>
            <FormControl size="small" className="min-w-[200px]">
              <InputLabel>Select Bargain</InputLabel>
              <Select
                value={selectedBargain}
                label="Select Bargain"
                onChange={(e) => setSelectedBargain(e.target.value)}
              >
                <MenuItem value="all">All Bargains</MenuItem>
                {dummyBargains.map(bargain => (
                  <MenuItem key={bargain.id} value={bargain.id}>{bargain.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Divider className="mb-4" />

          {/* Bargain Commission Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-semibold">Bargain Name</TableCell>
                  <TableCell className="font-semibold">Purchase Commission</TableCell>
                  <TableCell className="font-semibold">Sale Commission</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bargainCommissions
                  .filter(bc => selectedBargain === 'all' || bc.bargain_id === selectedBargain)
                  .map((bc) => (
                    <TableRow key={bc.bargain_id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <AttachMoney className="text-blue-600" fontSize="small" />
                          </div>
                          <span className="font-medium">{bc.bargain_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Chip 
                            label={bc.purchase_type.toUpperCase()}
                            color="primary"
                            size="small"
                          />
                          <span className="font-semibold text-blue-600">
                            {bc.purchase_type === 'percentage' 
                              ? `${bc.purchase_value}%`
                              : `PKR ${bc.purchase_value.toLocaleString()}`
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Chip 
                            label={bc.sale_type.toUpperCase()}
                            color="success"
                            size="small"
                          />
                          <span className="font-semibold text-green-600">
                            {bc.sale_type === 'percentage' 
                              ? `${bc.sale_value}%`
                              : `PKR ${bc.sale_value.toLocaleString()}`
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip label="Custom" color="warning" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Global Settings Row */}
                <TableRow className="bg-blue-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <Settings className="text-white" fontSize="small" />
                      </div>
                      <span className="font-medium">All Other Bargains (Global)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Chip 
                        label={settings.purchase_type.toUpperCase()}
                        color="default"
                        size="small"
                      />
                      <span className="font-semibold text-gray-700">
                        {settings.purchase_type === 'percentage' 
                          ? `${settings.purchase_value}%`
                          : `PKR ${settings.purchase_value.toLocaleString()}`
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Chip 
                        label={settings.sale_type.toUpperCase()}
                        color="default"
                        size="small"
                      />
                      <span className="font-semibold text-gray-700">
                        {settings.sale_type === 'percentage' 
                          ? `${settings.sale_value}%`
                          : `PKR ${settings.sale_value.toLocaleString()}`
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip label="Global" color="default" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

   
    </DashboardLayout>
  );
};

export default Commission;