'use client';
import React, { useRef, useState } from 'react';
import Modal from '../Modal';
import Portal from '@/utils/portal';

const OrderTable = ({
    headers,
    data,
    onDetail,
    onStatusChange,
    dropdownOpen,
    setDropdownOpen,
    statusModalOpen,
    setStatusModalOpen,
    selectedStatus,
    setSelectedStatus,
    onConfirmStatusChange,
}) => {
    const rowRefs = useRef([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const toggleStatusMenu = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const handleStatusChange = (row, status) => {
        setSelectedRow(row);
        setSelectedStatus(status);
        setStatusModalOpen(true);
    };

    return (
        <>
            <div className="!overflow-y-visible overflow-x-auto">
                {/* Table */}
                <table className="min-w-full bg-blackish2 border border-gray1">
                    <thead>
                        <tr>
                            {headers.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-nowrap border-b bg-blackish2 border-gray1 text-left text-xs font-semibold text-gray1 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                            <th className="px-6 py-3 border-b bg-blackish2 border-gray1 text-left text-xs font-semibold text-gray1 uppercase tracking-wider">
                                Detail
                            </th>
                            <th className="px-6 py-3 border-b bg-blackish2 border-gray1 text-left text-xs font-semibold text-gray1 uppercase tracking-wider">
                                Change Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                ref={(el) => (rowRefs.current[rowIndex] = el)}
                                className="hover:bg-gray-50 text-white hover:text-gray-700"
                            >
                                {headers.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 text-nowrap max-w-[250px] overflow-hidden text-ellipsis py-4 border-b border-gray-200 text-sm"
                                    >
                                        {row[column.accessor]}
                                    </td>
                                ))}
                                {/* Detail Button Column */}
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                    <button
                                        onClick={() => onDetail(row)}
                                        className="text-blue-600 text-nowrap hover:text-blue-800"
                                    >
                                        View Details
                                    </button>
                                </td>
                                {/* Status Change Column */}
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 relative">
                                    <button
                                        onClick={() => toggleStatusMenu(rowIndex)}
                                        className="text-gray-500 text-nowrap hover:text-gray-700 focus:outline-none"
                                    >
                                        Change Status
                                    </button>
                                    {dropdownOpen === rowIndex && (
                                        <Portal>
                                            <div
                                                className="fixed z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                                                style={{
                                                    top: `${
                                                        rowRefs.current[rowIndex]?.getBoundingClientRect()
                                                            .bottom + window.scrollY
                                                    }px`,
                                                    left: `${
                                                        rowRefs.current[rowIndex]?.getBoundingClientRect()
                                                            .right - 200
                                                    }px`,
                                                }}
                                            >
                                                <button
                                                    onClick={() => handleStatusChange(row, 'pending')}
                                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Pending
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(row, 'processing')}
                                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Processing
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(row, 'shipped')}
                                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Shipped
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(row, 'delivered')}
                                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Delivered
                                                </button>
                                            </div>
                                        </Portal>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Status Change Confirmation Modal */}
                <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)}>
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirm Status Change</h2>
                        <p className="mb-6">
                            Are you sure you want to change the status to{' '}
                            <strong>{selectedStatus}</strong>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setStatusModalOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirmStatusChange(selectedRow, selectedStatus);
                                    setStatusModalOpen(false);
                                }}
                                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default OrderTable;