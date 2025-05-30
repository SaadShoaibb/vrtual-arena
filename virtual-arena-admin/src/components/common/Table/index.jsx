'use client';
import React, { useRef, useState } from 'react';
import { FaEllipsisV, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Modal from '../Modal';

const DynamicTable = ({
    headers,
    data,
    onEdit,
    onDetail,
    onDelete,
    onConfirm,
    setDropdownOpen,
    dropdownOpen,
    deleteModalOpen,
    setDeleteModalOpen,
}) => {
    const rowRefs = useRef([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(data?.length / rowsPerPage);
    
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow);
    
    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    return (
        <>
            <div className="!overflow-y-visible overflow-x-auto">
                <table className="min-w-full bg-blackish2 border border-gray1">
                    <thead>
                        <tr>
                            {headers?.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-nowrap border-b bg-blackish2 border-gray1 text-left text-xs font-semibold text-gray1 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                            <th className="px-6 py-3 border-b bg-blackish2 border-gray1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows?.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                ref={(el) => (rowRefs.current[rowIndex] = el)}
                                className="hover:bg-gray-50 text-white hover:text-gray-700 relative"
                            >
                                {headers.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 text-nowrap max-w-[250px] overflow-hidden text-ellipsis py-4 border-b border-gray-200 text-sm"
                                    >
                                        {row[column.accessor]}
                                    </td>
                                ))}
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 relative">
                                    <button
                                        onClick={() => toggleDropdown(rowIndex)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        <FaEllipsisV />
                                    </button>
                                    {dropdownOpen === rowIndex && (
                                        <div
                                            className="absolute z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                                            style={{
                                                top: '100%',
                                                left: '0%',
                                                transform: 'translateX(-50%)',
                                            }}
                                        >
                                            <button onClick={() => onEdit(row)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Edit
                                            </button>
                                            <button onClick={() => onDetail(row)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Detail
                                            </button>
                                            <button onClick={() => onDelete(row)} className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination */}
                <div className="flex justify-center items-center mt-4 space-x-2">
                    {currentPage > 1 && (
                        <button onClick={() => setCurrentPage(currentPage - 1)} className="text-gray-400 hover:text-white">
                            <FaChevronLeft />
                        </button>
                    )}
                    {[...Array(Math.min(5, totalPages)).keys()].map((num) => (
                        <button
                            key={num + 1}
                            onClick={() => setCurrentPage(num + 1)}
                            className={`px-3 py-1 rounded ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        >
                            {num + 1}
                        </button>
                    ))}
                    {currentPage < totalPages && (
                        <button onClick={() => setCurrentPage(currentPage + 1)} className="text-gray-400 hover:text-white">
                            <FaChevronRight />
                        </button>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p className="mb-6">Are you sure you want to delete this session?</p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={onConfirm} className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg">
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default DynamicTable;
