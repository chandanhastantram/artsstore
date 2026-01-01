'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

interface CustomizationOption {
    _id: string;
    type: string;
    name: string;
    value: string;
    hexCode?: string;
    priceModifier: number;
}

interface CustomizationPanelProps {
    onCustomizationChange: (customization: {
        threadColor: string;
        threadType: string;
        kundanType: string;
        kundanShape: string;
        kundanColor: string;
    }) => void;
    basePrice: number;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
    onCustomizationChange,
    basePrice,
}) => {
    const [options, setOptions] = useState<{
        threadColors: CustomizationOption[];
        threadTypes: CustomizationOption[];
        kundanTypes: CustomizationOption[];
        kundanShapes: CustomizationOption[];
        kundanColors: CustomizationOption[];
    }>({
        threadColors: [],
        threadTypes: [],
        kundanTypes: [],
        kundanShapes: [],
        kundanColors: [],
    });

    const [selected, setSelected] = useState({
        threadColor: '',
        threadType: '',
        kundanType: '',
        kundanShape: '',
        kundanColor: '',
    });

    const [totalPrice, setTotalPrice] = useState(basePrice);

    useEffect(() => {
        fetchCustomizationOptions();
    }, []);

    const fetchCustomizationOptions = async () => {
        try {
            const response = await api.get('/customization');
            setOptions(response.data.options);

            // Set default selections
            if (response.data.options.threadColors.length > 0) {
                const defaultThreadColor = response.data.options.threadColors[0];
                setSelected(prev => ({ ...prev, threadColor: defaultThreadColor.hexCode || '#D4AF37' }));
            }
            if (response.data.options.kundanColors.length > 0) {
                const defaultKundanColor = response.data.options.kundanColors[0];
                setSelected(prev => ({ ...prev, kundanColor: defaultKundanColor.hexCode || '#50C878' }));
            }
            if (response.data.options.kundanShapes.length > 0) {
                setSelected(prev => ({ ...prev, kundanShape: response.data.options.kundanShapes[0].value }));
            }
            if (response.data.options.kundanTypes.length > 0) {
                setSelected(prev => ({ ...prev, kundanType: response.data.options.kundanTypes[0].value }));
            }
        } catch (error) {
            console.error('Error fetching customization options:', error);
        }
    };

    useEffect(() => {
        onCustomizationChange(selected);
        calculateTotalPrice();
    }, [selected]);

    const calculateTotalPrice = () => {
        let additionalCost = 0;

        // Add price modifiers from selected options
        Object.entries(selected).forEach(([key, value]) => {
            const optionType = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const optionsList = options[`${key}s` as keyof typeof options] || [];
            const selectedOption = optionsList.find(opt => opt.value === value || opt.hexCode === value);
            if (selectedOption) {
                additionalCost += selectedOption.priceModifier;
            }
        });

        setTotalPrice(basePrice + additionalCost);
    };

    const handleSelection = (category: keyof typeof selected, value: string) => {
        setSelected(prev => ({ ...prev, [category]: value }));
    };

    return (
        <Card className="sticky top-24">
            <CardBody>
                <h3 className="text-2xl font-serif font-bold mb-6">Customize Your Bangle</h3>

                {/* Thread Color */}
                {options.threadColors.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Thread Color
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                            {options.threadColors.map((color) => (
                                <button
                                    key={color._id}
                                    onClick={() => handleSelection('threadColor', color.hexCode || '#D4AF37')}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${selected.threadColor === color.hexCode
                                            ? 'border-gold-500 scale-110'
                                            : 'border-gray-300 hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color.hexCode }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Thread Type */}
                {options.threadTypes.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Thread Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {options.threadTypes.map((type) => (
                                <button
                                    key={type._id}
                                    onClick={() => handleSelection('threadType', type.value)}
                                    className={`px-4 py-2 rounded-md border-2 transition-all ${selected.threadType === type.value
                                            ? 'border-gold-500 bg-gold-50'
                                            : 'border-gray-300 hover:border-gold-300'
                                        }`}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Kundan Type */}
                {options.kundanTypes.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Kundan Type
                        </label>
                        <div className="space-y-2">
                            {options.kundanTypes.map((type) => (
                                <button
                                    key={type._id}
                                    onClick={() => handleSelection('kundanType', type.value)}
                                    className={`w-full px-4 py-3 rounded-md border-2 transition-all text-left ${selected.kundanType === type.value
                                            ? 'border-gold-500 bg-gold-50'
                                            : 'border-gray-300 hover:border-gold-300'
                                        }`}
                                >
                                    <div className="font-medium">{type.name}</div>
                                    {type.priceModifier > 0 && (
                                        <div className="text-sm text-gray-600">+₹{type.priceModifier}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Kundan Shape */}
                {options.kundanShapes.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Kundan Shape
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {options.kundanShapes.map((shape) => (
                                <button
                                    key={shape._id}
                                    onClick={() => handleSelection('kundanShape', shape.value)}
                                    className={`px-4 py-2 rounded-md border-2 transition-all ${selected.kundanShape === shape.value
                                            ? 'border-gold-500 bg-gold-50'
                                            : 'border-gray-300 hover:border-gold-300'
                                        }`}
                                >
                                    {shape.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Kundan Color */}
                {options.kundanColors.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Kundan Color
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                            {options.kundanColors.map((color) => (
                                <button
                                    key={color._id}
                                    onClick={() => handleSelection('kundanColor', color.hexCode || '#50C878')}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${selected.kundanColor === color.hexCode
                                            ? 'border-gold-500 scale-110'
                                            : 'border-gray-300 hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color.hexCode }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Display */}
                <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-medium">₹{basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Price:</span>
                        <span className="text-gold-600">₹{totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
