'use client';
import React, { useRef } from 'react';

const PaymentTable = ({
    headers,
    data,
    onDetail,
    dropdownOpen,
    setDropdownOpen,
}) => {
    const rowRefs = useRef([]);

    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
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
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default PaymentTable;