'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import EditUserForm from './EditUserForm';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import DynamicTable from '@/components/common/Table';
import DetailView from '@/components/Detail';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sidebarMode, setSidebarMode] = useState('view'); // 'view' or 'edit'
    const [selectedRow, setSelectedRow] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Define table columns for users
    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Role', accessor: 'role' },
        { header: 'Status', accessor: 'status' },
    ];

    // Format date of birth for display
    const formatDateOfBirth = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US");
    };

    // Map users data for the table
    const data = users.map((user) => ({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone || 'N/A',
        role: user.role,
        status: user.is_active ? 'Active' : 'Inactive',
        is_blocked: user.is_blocked,
        is_active:user?.is_active,
        birthday: formatDateOfBirth(user.birthday),
    }));

    // Fetch users from the API
    const handleFetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/users/`, getAuthHeaders());
            setUsers(response?.data?.users);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        handleFetchUsers();
    }, []);

    // Handle user deletion
    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModalOpen(true);
    };

    // Confirm user deletion
    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/admin/user/${selectedRow.user_id}`, getAuthHeaders());
            if (response.status === 200) {
                toast.success('User deleted successfully');
                handleFetchUsers();
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete user');
        }
        setDeleteModalOpen(false);
        setDropdownOpen(null);
    };

    // Handle user edit
    const handleEdit = (row) => {
        setSelectedUser(row);
        setSidebarMode('edit');
        setSidebarOpen(true);
        setDropdownOpen(null);
    };

    // Handle user detail view
    const handleDetail = (row) => {
        setSelectedUser(row);
        setSidebarMode('view');
        setSidebarOpen(true);
        setDropdownOpen(null);
    };

    // Handle saving updated user details
    const handleSave = async (updatedUser) => {
        const payload = {
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            birthday: updatedUser.birthday,
            is_active: updatedUser.is_active,
            is_blocked: updatedUser.is_blocked,
            role: updatedUser.role,
        };
        try {
            const response = await axios.put(`${API_URL}/admin/user/${updatedUser.user_id}`, payload, getAuthHeaders());
            if (response.status === 200) {
                toast.success('User updated successfully');
                handleFetchUsers();
                setSidebarOpen(false);
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to update user');
        }
    };

    // Data for the detail view
    const userData = [
        { label: "Name", value: selectedUser?.name },
        { label: "Email", value: selectedUser?.email },
        { label: "Phone", value: selectedUser?.phone || 'N/A' },
        { label: "Role", value: selectedUser?.role },
        { label: "Status", value: selectedUser?.is_active ? 'Active' : 'Inactive' },
        { label: "Blocked", value: selectedUser?.is_blocked ? 'Yes' : 'No' },
        { label: "Birthday", value: formatDateOfBirth(selectedUser?.birthday) },
    ];

    return (
        <div className="p-2 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gradiant">Users</h1>
            <DynamicTable
                headers={columns}
                data={data}
                onEdit={handleEdit}
                onDetail={handleDetail}
                onDelete={handleDelete}
                onConfirm={confirmDelete}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
            />
            {sidebarOpen && (
                <div className='fixed right-0 top-0 min-h-screen w-1/2'>
                    <div className={`w-full absolute right-0 transform transition-transform duration-300 ease-in-out top-0 h-screen bg-blackish2 border-l ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                        } border-gray-200 p-6`}>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <span className='min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold'>&times;</span>
                        </button>
                        {sidebarMode === 'edit' ? (
                            <EditUserForm data={selectedUser} onSave={handleSave} />
                        ) : (
                            <DetailView data={userData} title='User Details' />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;