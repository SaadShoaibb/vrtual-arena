'use client'
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import DetailView from '@/components/Detail';
import DynamicTable from '@/components/common/Table';
import EditTournamentForm from './EditTournamentForm';

const Tournaments = () => {
    const [tournaments, setTournaments] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [sidebarMode, setSidebarMode] = useState('view'); // 'view' or 'edit'
    const [selectedRow, setSelectedRow] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Start Date', accessor: 'startDate' },
        { header: 'End Date', accessor: 'endDate' },
        { header: 'Status', accessor: 'status' },
        // { header: 'Slots', accessor: 'slots' },
        // { header: 'tournaments', accessor: 'tournaments' },
    ];
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }) + ` ${date.toISOString().split("T")[0]}`;
    };
    const data = tournaments.map((tournament) => ({
        name: tournament.name,
        tournament_id: tournament.tournament_id,
        start_date: tournament.start_date,
        startDate: formatDateTime(tournament.start_date),
        endDate: formatDateTime(tournament.end_date),
        end_date: tournament.end_date,
        status: tournament.status,
    }));

    const handleFetchtournaments = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/get-tournaments/`, getAuthHeaders())
            console.log(response)
            setTournaments(response?.data?.tournaments)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchtournaments()
    }, [])

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModalOpen(true);
    };

    const handleSave = async (updatedTournament) => {
        console.log(updatedTournament)
        const formatToMySQLDateTime = (dateTimeLocal) => {
            if (!dateTimeLocal) return '';

            // Convert local datetime (YYYY-MM-DDTHH:MM) to a Date object
            const date = new Date(dateTimeLocal);

            // Extract individual components in correct format
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit format
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // Format to MySQL DATETIME format: "YYYY-MM-DD HH:MM:SS"
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const payload = {
            name: updatedTournament.name,
            start_date: formatToMySQLDateTime(updatedTournament.start_date),
            end_date: formatToMySQLDateTime(updatedTournament.end_date),
            status: updatedTournament.status
        }
        try {
            const response = await axios.put(`${API_URL}/admin/update-tournament/${updatedTournament?.tournament_id}`, payload, getAuthHeaders())

            if (response.status === 200) {
                toast.success('Booking Updated')
                handleFetchtournaments()
                setSidebarOpen(false);
            } else {
                toast.error('Somemthing went wrong.')
            }
        } catch (error) {

        }
    };


    const confirmDelete = async () => {
        handleDelete(selectedRow);
        try {
            const response = await axios.delete(`${API_URL}/admin/delete-tournament/${selectedRow.tournament_id}`, getAuthHeaders())
            if (response.status === 200) {
                toast.success(`Tournaent Deleted`)
                handleFetchtournaments()
            } else {
                toast.error('Something went wrong..')
            }
        } catch (error) {
            console.log(error)
        }
        setDeleteModalOpen(false);
        setDropdownOpen(null)
    };


    const handleEdit = (row) => {

        setSelectedTournament(row);
        setSidebarMode('edit');
        setSidebarOpen(true);
        setDropdownOpen(null)
    };

    const handleDetail = (row) => {
        setSelectedTournament(row);
        setSidebarMode('view');
        setSidebarOpen(true);
        setDropdownOpen(null)
    };

    const bookingData = [
        { label: "Name", value: selectedTournament?.name },
        { label: "startTime", value: selectedTournament?.startDate },
        { label: "endTime", value: selectedTournament?.endDate },
        { label: "Payment Status", value: selectedTournament?.status },
    ];
  return (
    <div className="p-2 md:p-6 ">
    <h1 className="text-2xl font-bold mb-6 text-gradiant">Tournaments</h1>
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
                    <EditTournamentForm data={selectedTournament} onSave={handleSave} />
                ) : (
                    <DetailView data={bookingData} title='Booking Details' type="TOURNAMENT" id={selectedTournament?.tournament_id} />
                )}
            </div>
        </div>
    )}
</div>
  )
}

export default Tournaments
