// Skeleton loading components for better UX

import React from 'react';

export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-200" />
        <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded" />
        </div>
    </div>
);

export const OrderCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-20" />
        </div>
        <div className="space-y-3">
            <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
            </div>
        </div>
        <div className="mt-4 h-10 bg-gray-200 rounded" />
    </div>
);

export const ProfileSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-64" />
            </div>
        </div>
        <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <th key={i} className="px-6 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {Array.from({ length: rows }).map((_, i) => (
                    <tr key={i}>
                        {[1, 2, 3, 4, 5].map((j) => (
                            <td key={j} className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-32" />
    </div>
);
