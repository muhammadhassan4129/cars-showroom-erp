import React, { useState } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Box,
  Chip,
} from '@mui/material';
import {
  Assessment,
  ShoppingCart,
  Sell,
  Payment,
  People,
  DirectionsCar,
  Print,
  Download,
  TrendingUp,
  TrendingDown,
  AttachMoney,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { 
  dummyPurchases, 
  dummySales, 
  dummyInstallments, 
  dummyCustomers, 
  dummyVehicles 
} from '../Utils/dummyData';

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('summary');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Calculate Summary Stats
  const totalPurchases = dummyPurchases.length;
  const totalSales = dummySales.length;
  const totalPurchaseAmount = dummyPurchases.reduce((sum, p) => sum + p.purchase_price, 0);
  const totalSaleAmount = dummySales.reduce((sum, s) => sum + s.sale_price, 0);
  const totalPurchaseCommission = dummyPurchases.reduce((sum, p) => sum + p.commission, 0);
  const totalSaleCommission = dummySales.reduce((sum, s) => sum + s.commission, 0);
  const totalCommission = totalPurchaseCommission + totalSaleCommission;
  const grossProfit = totalSaleAmount - totalPurchaseAmount;
  const netProfit = grossProfit - totalCommission;

  const pendingInstallments = dummyInstallments.filter(i => i.status === 'pending').length;
  const paidInstallments = dummyInstallments.filter(i => i.status === 'paid').length;
  const totalPendingAmount = dummyInstallments
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.installment_amount, 0);

  // Monthly Sales Data (Dummy)
  const monthlySalesData = [
    { month: 'Jan', sales: 2500000, purchases: 2200000, profit: 300000 },
    { month: 'Feb', sales: 2800000, purchases: 2400000, profit: 400000 },
    { month: 'Mar', sales: 3200000, purchases: 2800000, profit: 400000 },
    { month: 'Apr', sales: 2900000, purchases: 2600000, profit: 300000 },
    { month: 'May', sales: 3500000, purchases: 3000000, profit: 500000 },
    { month: 'Jun', sales: 3800000, purchases: 3200000, profit: 600000 },
  ];

  // Vehicle Status Data
  const vehicleStatusData = [
    { name: 'Available', value: dummyVehicles.filter(v => v.status === 'available').length },
    { name: 'Sold', value: dummyVehicles.filter(v => v.status === 'sold').length },
    { name: 'Reserved', value: dummyVehicles.filter(v => v.status === 'reserved').length },
  ];

  // Customer Type Data
  const customerTypeData = [
    { name: 'Buyers', value: dummyCustomers.filter(c => c.type === 'buyer').length },
    { name: 'Sellers', value: dummyCustomers.filter(c => c.type === 'seller').length },
    { name: 'Both', value: dummyCustomers.filter(c => c.type === 'both').length },
  ];

  // Payment Type Data
  const paymentTypeData = [
    { 
      name: 'Cash Purchases', 
      value: dummyPurchases.filter(p => p.payment_type === 'cash').length 
    },
    { 
      name: 'Installment Purchases', 
      value: dummyPurchases.filter(p => p.payment_type === 'installment').length 
    },
    { 
      name: 'Cash Sales', 
      value: dummySales.filter(s => s.payment_type === 'cash').length 
    },
    { 
      name: 'Installment Sales', 
      value: dummySales.filter(s => s.payment_type === 'installment').length 
    },
  ];

  // Summary Report Tab
  const SummaryReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Purchases</p>
                  <p className="text-3xl font-bold">{totalPurchases}</p>
                  <p className="text-sm mt-2">PKR {(totalPurchaseAmount / 1000000).toFixed(1)}M</p>
                </div>
                <ShoppingCart style={{ fontSize: 48, opacity: 0.3 }} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Sales</p>
                  <p className="text-3xl font-bold">{totalSales}</p>
                  <p className="text-sm mt-2">PKR {(totalSaleAmount / 1000000).toFixed(1)}M</p>
                </div>
                <Sell style={{ fontSize: 48, opacity: 0.3 }} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Commission</p>
                  <p className="text-3xl font-bold">PKR {(totalCommission / 1000).toFixed(0)}K</p>
                  <p className="text-sm mt-2">
                    <TrendingUp className="inline" fontSize="small" /> +12%
                  </p>
                </div>
                <AttachMoney style={{ fontSize: 48, opacity: 0.3 }} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Net Profit</p>
                  <p className="text-3xl font-bold">PKR {(netProfit / 1000).toFixed(0)}K</p>
                  <p className="text-sm mt-2">After Commission</p>
                </div>
                <TrendingUp style={{ fontSize: 48, opacity: 0.3 }} />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `PKR ${(value / 1000).toFixed(0)}K`} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="purchases" stroke="#3b82f6" strokeWidth={2} name="Purchases" />
                  <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Vehicle Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vehicleStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Payment Methods Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Customer Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );

  // Purchase Report Tab
  const PurchaseReport = () => (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium">{purchase.customer_name}</td>
                  <td className="px-4 py-3 text-sm">{purchase.vehicle_name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    PKR {purchase.purchase_price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-purple-600">
                    PKR {purchase.commission.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Chip 
                      label={purchase.payment_type === 'cash' ? 'Cash' : 'Installment'}
                      color={purchase.payment_type === 'cash' ? 'success' : 'warning'}
                      size="small"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan="3" className="px-4 py-3 text-right">TOTAL:</td>
                <td className="px-4 py-3 text-green-600">PKR {totalPurchaseAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-purple-600">PKR {totalPurchaseCommission.toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  // Sales Report Tab
  const SalesReport = () => (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Sales Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummySales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium">{sale.customer_name}</td>
                  <td className="px-4 py-3 text-sm">{sale.vehicle_name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    PKR {sale.sale_price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                    PKR {sale.commission.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Chip 
                      label={sale.payment_type === 'cash' ? 'Cash' : 'Installment'}
                      color={sale.payment_type === 'cash' ? 'success' : 'warning'}
                      size="small"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan="3" className="px-4 py-3 text-right">TOTAL:</td>
                <td className="px-4 py-3 text-green-600">PKR {totalSaleAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-blue-600">PKR {totalSaleCommission.toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  // Installment Report Tab
  const InstallmentReport = () => (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Installment Summary</h3>
        
        {/* Stats */}
        <Grid container spacing={2} className="mb-6">
          <Grid item xs={12} md={4}>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-orange-600 text-sm font-medium">Pending Installments</p>
              <p className="text-2xl font-bold text-orange-700">{pendingInstallments}</p>
              <p className="text-sm text-orange-600 mt-1">PKR {(totalPendingAmount / 1000).toFixed(0)}K</p>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Paid Installments</p>
              <p className="text-2xl font-bold text-green-700">{paidInstallments}</p>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">Total Installments</p>
              <p className="text-2xl font-bold text-blue-700">{dummyInstallments.length}</p>
            </div>
          </Grid>
        </Grid>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyInstallments.slice(0, 10).map((inst) => (
                <tr key={inst.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Chip 
                      label={inst.type.toUpperCase()}
                      color={inst.type === 'sale' ? 'success' : 'primary'}
                      size="small"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{inst.customer_name}</td>
                  <td className="px-4 py-3 text-sm">{inst.vehicle_name}</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    PKR {inst.installment_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(inst.due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Chip 
                      label={inst.status.toUpperCase()}
                      color={inst.status === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outlined" startIcon={<Print />}>
            Print
          </Button>
          <Button variant="contained" startIcon={<Download />} style={{ backgroundColor: '#2563eb' }}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                label="From Date"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="To Date"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="summary">Summary Report</MenuItem>
                  <MenuItem value="detailed">Detailed Report</MenuItem>
                  <MenuItem value="monthly">Monthly Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" fullWidth style={{ backgroundColor: '#2563eb' }}>
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Summary" icon={<Assessment />} iconPosition="start" />
            <Tab label="Purchases" icon={<ShoppingCart />} iconPosition="start" />
            <Tab label="Sales" icon={<Sell />} iconPosition="start" />
            <Tab label="Installments" icon={<Payment />} iconPosition="start" />
          </Tabs>
        </Box>

        <CardContent>
          {tabValue === 0 && <SummaryReport />}
          {tabValue === 1 && <PurchaseReport />}
          {tabValue === 2 && <SalesReport />}
          {tabValue === 3 && <InstallmentReport />}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Reports;