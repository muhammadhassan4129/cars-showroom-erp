import React from 'react';
import { useAuth } from '../Context/AuthContext';
import DashboardLayout from '../Components/layout/DashboardLayout';
import {
    DirectionsCar,
    ShoppingCart,
    Sell,
    Payment,
    TrendingUp,
    TrendingDown,
} from '@mui/icons-material';

const Dashboard = () => {
    const { user, isSuperAdmin } = useAuth();

    // Dummy stats
    const stats = [
        {
            title: 'Total Vehicles',
            value: '24',
            change: '+12%',
            isPositive: true,
            icon: <DirectionsCar className="text-blue-600" fontSize="large" />,
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Total Purchases',
            value: '18',
            change: '+8%',
            isPositive: true,
            icon: <ShoppingCart className="text-green-600" fontSize="large" />,
            bgColor: 'bg-green-100',
        },
        {
            title: 'Total Sales',
            value: '12',
            change: '+15%',
            isPositive: true,
            icon: <Sell className="text-purple-600" fontSize="large" />,
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Pending Payments',
            value: '5',
            change: '-3%',
            isPositive: false,
            icon: <Payment className="text-red-600" fontSize="large" />,
            bgColor: 'bg-red-100',
        },
    ];

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
                <p className="text-gray-600 mt-1">
                    {isSuperAdmin()
                        ? 'Monitor all bargains and system performance'
                        : 'Track your bargain performance and transactions'
                    }
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center gap-1">
                                {stat.isPositive ? (
                                    <TrendingUp className="text-green-600" fontSize="small" />
                                ) : (
                                    <TrendingDown className="text-red-600" fontSize="small" />
                                )}
                                <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Purchases */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Purchases</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <DirectionsCar className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Honda Civic 2020</p>
                                        <p className="text-xs text-gray-500">2 days ago</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-gray-800">PKR 2,500,000</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Sell className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Toyota Corolla 2019</p>
                                        <p className="text-xs text-gray-500">1 day ago</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-gray-800">PKR 2,800,000</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;