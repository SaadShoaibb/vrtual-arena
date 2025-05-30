'use client'
import EditForm from '@/components/common/EditForm';
import DynamicTable from '@/components/common/Table';
import DetailView from '@/components/Detail';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EditCardsForm from './EditeCardsForm';

const AllCards = () => {
    const columns = [
        { header: 'Card Code', accessor: 'code' },
        { header: 'Amount', accessor: 'amounts' },
        { header: 'Created By', accessor: 'created_by' },
        { header: 'Status', accessor: 'status' },
    ];

    const [cards, setCards] = useState([]);
    const data = cards?.map((card) => ({
        card_id: card.gift_card_id,
        code: card.code,
        amounts: `$${card.amount}`,
        amount:card.amount,
        created_by: card.created_by,
        status: card.status,
        is_active: card.is_active,
    }));

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [sidebarMode, setSidebarMode] = useState('view');
    const [selectedRow, setSelectedRow] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const fetchGiftCards = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/get-all/`, getAuthHeaders());
            setCards(response?.data?.cards);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGiftCards();
    }, []);

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModalOpen(true);
    };

    const handleSave = async (updatedCard) => {
        const payload = {
            code: updatedCard.code,
            amount: updatedCard.amount,
            is_active: updatedCard.is_active,
        };

        try {
            const response = await axios.put(`${API_URL}/admin/${updatedCard?.card_id}`, payload, getAuthHeaders());

            if (response.status === 200) {
                toast.success('Gift Card Updated');
                fetchGiftCards();
                setSidebarOpen(false);
            } else {
                toast.error('Something went wrong.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/admin/${selectedRow.card_id}`, getAuthHeaders());
            if (response.status === 200) {
                toast.success(`${selectedRow.code} Deleted`);
                fetchGiftCards();
            } else {
                toast.error('Something went wrong..');
            }
        } catch (error) {
            console.error(error);
        }
        setDeleteModalOpen(false);
        setDropdownOpen(null);
    };

    const handleEdit = (row) => {
        setSelectedCard(row);
        setSidebarMode('edit');
        setSidebarOpen(true);
        setDropdownOpen(null);
    };

    const handleDetail = (row) => {
        setSelectedCard(row);
        setSidebarMode('view');
        setSidebarOpen(true);
        setDropdownOpen(null);
    };

    const cardData = [
        { label: "Card Code", value: selectedCard?.code },
        { label: "Amount", value: selectedCard?.amount },
        { label: "Created By", value: selectedCard?.created_by },
        { label: "Status", value: selectedCard?.status },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gradiant">Gift Cards</h1>
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
                            <EditCardsForm data={selectedCard} onSave={handleSave} />
                        ) : (
                            <DetailView data={cardData} title='Gift Card Details' />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllCards;
