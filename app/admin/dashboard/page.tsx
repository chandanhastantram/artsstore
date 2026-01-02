'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock, Layout } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
      ]);

      const products = productsRes.data.products || [];
      const orders = ordersRes.data.orders || [];

      const revenue = orders.reduce((sum: number, order: any) => sum + (order.pricing?.total || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: 0, // Will need users endpoint
        totalRevenue: revenue,
        recentOrders: orders.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-gold-500',
    },
    {
      title: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="shimmer h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-sm">{order.shippingAddress?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm font-medium">₹{order.pricing?.total.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card hover className="cursor-pointer" onClick={() => window.location.href = '/admin/products'}>
          <CardBody className="text-center">
            <Package className="w-12 h-12 text-gold-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Manage Products</h3>
            <p className="text-sm text-gray-600">Add, edit, or remove products</p>
          </CardBody>
        </Card>

        <Card hover className="cursor-pointer" onClick={() => window.location.href = '/admin/orders'}>
          <CardBody className="text-center">
            <ShoppingCart className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">View Orders</h3>
            <p className="text-sm text-gray-600">Manage customer orders</p>
          </CardBody>
        </Card>

        {isSuperAdmin && (
          <Card hover className="cursor-pointer" onClick={() => window.location.href = '/admin/customization'}>
            <CardBody className="text-center">
              <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Customization Options</h3>
              <p className="text-sm text-gray-600">Manage thread & kundan options</p>
            </CardBody>
          </Card>
        )}

        {isSuperAdmin && (
          <Card hover className="cursor-pointer" onClick={() => window.location.href = '/admin/homepage'}>
            <CardBody className="text-center">
              <Layout className="w-12 h-12 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Edit Homepage</h3>
              <p className="text-sm text-gray-600">Customize hero, slides & sections</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
