"use client"
import EditForm from '@/components/common/EditForm';
import DynamicTable from '@/components/common/Table';
import DetailView from '@/components/Detail';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import pusher from '@/utils/pusher';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Sessions = () => {
    const columns = [
        { header: 'Session Name', accessor: 'name' },
        { header: 'Duration', accessor: 'duration' },
        { header: 'Max Players', accessor: 'maxPlayers' },
        { header: 'Price', accessor: 'session_price' },
        { header: 'Status', accessor: 'status' },
        // { header: 'Slots', accessor: 'slots' },
        // { header: 'Bookings', accessor: 'bookings' },
    ];
    const [sessions, setSessions] = useState([])
    const data = sessions?.map((session) => ({
        name: session.name,
        session_id: session.session_id,
        duration_minutes: session.duration_minutes,
        duration: `${session.duration_minutes} mins`,
        maxPlayers: session.max_players,
        max_players: session.max_players,
        session_price: `$${session.price}`,
        price: session.price,
        status: session.is_active ? 'Active' : 'Inactive',
        is_active: session.is_active,
        slots: session?.available_slots,
        bookings: session?.booking_count,
        description: session?.description,
    }));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sidebarMode, setSidebarMode] = useState('view'); // 'view' or 'edit'
    const [selectedRow, setSelectedRow] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleFetchSessions = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/get-sessions/`, getAuthHeaders())
            setSessions(response?.data?.sessions)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchSessions()
    }, [])

    useEffect(() => {
        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', (data) => {
        //   console.log('New order notification:', data);
        handleFetchSessions()
        //   alert(`New order created: ${data.message}`);/
        });
    
        // Cleanup
        return () => {
          pusher.unsubscribe('my-channel');
        };
      }, []);
    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModalOpen(true);
    };
    const handleSave = async (updatedSession) => {
        const payload = {
            name: updatedSession.name,
            description: updatedSession.description,
            duration_minutes: updatedSession.duration_minutes,
            is_active: updatedSession.is_active,
            price: updatedSession.price,
            max_players: updatedSession.max_players

        }
        try {
            const response = await axios.put(`${API_URL}/admin/update-session/${updatedSession?.session_id}`, payload, getAuthHeaders())
            
            if (response.status === 200) {
                toast.success('Session Updated')
                handleFetchSessions()
                setSidebarOpen(false);
            } else {
                toast.error('Somemthing went wrong.')
            }
        } catch (error) {

        }
    };

    const confirmDelete = async() => {
        handleDelete(selectedRow);
        try {
            const response = await axios.delete(`${API_URL}/admin/delete-session/${selectedRow.session_id}`,getAuthHeaders())
            if(response.status === 200){
                toast.success(`${selectedRow.name} Session Deleted`)
                handleFetchSessions()
            }else{
                toast.error('Something went wrong..')
            }
        } catch (error) {
            console.log(error)
        }
        setDeleteModalOpen(false);
        setDropdownOpen(null)
    };

    const handleEdit = (row) => {

        setSelectedSession(row);
        setSidebarMode('edit');
        setSidebarOpen(true);
        setDropdownOpen(null)
    };

    const handleDetail = (row) => {
        setSelectedSession(row);
        setSidebarMode('view');
        setSidebarOpen(true);
        setDropdownOpen(null)
    };
    const sessionData = [
        { label: "Name", value: selectedSession?.name },
        { label: "Duration", value: selectedSession?.duration },
        { label: "Max Players", value: selectedSession?.maxPlayers },
        { label: "Price", value: selectedSession?.price },
        { label: "Status", value: selectedSession?.status },
        { label: "Total Bookings", value: selectedSession?.bookings },
        { label: "Available Slots", value: selectedSession?.slots },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gradiant">Sessions</h1>
            <DynamicTable
                headers={columns}
                data={data}
                onEdit={handleEdit}
                onDetail={handleDetail}
                onDelete={handleDelete}
                onConfirm={confirmDelete}
                sidebarMode={sidebarMode}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
            />
           {sidebarOpen && (
                           <div className='fixed right-0 top-0 min-h-screen w-1/2'>
                               <div className={`w-full absolute right-0 transform transition-transform duration-300 ease-in-out top-0 h-screen bg-blackish2 border-l ${
                               sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                           } border-gray-200 p-6`}>
           
                               <button
                                   onClick={() => setSidebarOpen(false)}
                                   className="text-gray-500 hover:text-gray-700 mb-4"
                                   >
                                   <span className='min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold'>&times;</span> 
                               </button>
                               {sidebarMode === 'edit' ? (
                                   <EditForm data={selectedSession} onSave={handleSave} />
                               ) : (
                                   <DetailView data={sessionData} title='Session Details' />
                               )}
                               </div>
                           </div>
                       )}
        </div>
    );
};

export default Sessions;