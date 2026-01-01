'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCustomizationPage() {
  const [options, setOptions] = useState<any>({
    threadColors: [],
    threadTypes: [],
    kundanTypes: [],
    kundanShapes: [],
    kundanColors: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await api.get('/customization');
      setOptions(response.data.options || {});
    } catch (error) {
      console.error('Error fetching customization options:', error);
      toast.error('Failed to load customization options');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this option?')) return;

    try {
      await api.delete(`/customization/${id}`);
      toast.success('Option deleted successfully');
      fetchOptions();
    } catch (error) {
      toast.error('Failed to delete option');
    }
  };

  const renderOptionSection = (title: string, items: any[], type: string) => (
    <Card className="mb-6">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button size="sm" onClick={() => toast.info('Add feature coming soon')}>
            <Plus className="w-4 h-4 mr-2" />
            Add {title.slice(0, -1)}
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No options added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item: any) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {item.hexCode && (
                    <div
                      className="w-10 h-10 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: item.hexCode }}
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.value}</p>
                    {item.priceModifier > 0 && (
                      <p className="text-xs text-green-600">+₹{item.priceModifier}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toast.info('Edit feature coming soon')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Customization Options</h1>
      <p className="text-gray-600 mb-8">
        Manage thread colors, kundan types, shapes, and colors for product customization
      </p>

      {renderOptionSection('Thread Colors', options.threadColors, 'thread-color')}
      {renderOptionSection('Thread Types', options.threadTypes, 'thread-type')}
      {renderOptionSection('Kundan Types', options.kundanTypes, 'kundan-type')}
      {renderOptionSection('Kundan Shapes', options.kundanShapes, 'kundan-shape')}
      {renderOptionSection('Kundan Colors', options.kundanColors, 'kundan-color')}
    </div>
  );
}
