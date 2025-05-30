'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import { useSelector } from 'react-redux';
import PaymentModal from '@/app/components/PaymentForm';
import AuthModel from '@/app/components/AuthModal';

const GiftCardStore = () => {
    const [giftCards, setGiftCards] = useState([]); // Available gift cards
    const [userGiftCards, setUserGiftCards] = useState([]); // User's purchased gift cards
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error message
    const [redeemAmount, setRedeemAmount] = useState(0); // Amount to redeem
    const [selectedGiftCard, setSelectedGiftCard] = useState(null); // Selected gift card for payment
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Payment modal state

    const { userData } = useSelector((state) => state.userData);
    const userId = userData?.user_id;

    // Fetch available gift cards
    useEffect(() => {
        const fetchGiftCards = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/gift-cards`, getAuthHeaders());
                setGiftCards(response.data.cards);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch gift cards. Please try again later.');
                setLoading(false);
            }
        };

        fetchGiftCards();
    }, []);

    // Fetch user's purchased gift cards
    const fetchUserGiftCards = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());
            setUserGiftCards(response.data);
        } catch (err) {
            setError('Failed to fetch your gift cards.');
        }
    };

    // Handle purchase button click
    const handlePurchaseClick = (giftCard) => {
        setSelectedGiftCard(giftCard);
        setIsPaymentModalOpen(true);
    };

    // Handle successful payment
    const handlePaymentSuccess = async () => {
        alert('Payment succeeded!');
        try {
            const payload = {
                user_id: userId,
                gift_card_id: selectedGiftCard?.gift_card_id
            }
            const response = await axios.post(`${API_URL}/user/purchase`, payload, getAuthHeaders())
            console.log(response)
            fetchUserGiftCards(); // Refresh user's gift cards
        } catch (error) {
            console.log(error)
        }
    };
    console.log(selectedGiftCard)
    // Redeem a gift card
    const handleRedeem = async (giftCardId) => {
        try {
            const response = await axios.post(
                `${API_URL}/user/redeem`,
                { user_id: userId, gift_card_id: giftCardId, amount_used: redeemAmount },
                getAuthHeaders()
            );

            if (response.status === 200) {
                alert(`Gift card redeemed successfully! Remaining balance: $${response.data.remaining_balance}`);
                fetchUserGiftCards(); // Refresh user's gift cards
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to redeem gift card.');
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserGiftCards(); // Fetch user's gift cards when userId is available
        }
    }, [userId]);

    return (
        <div className="bg-blackish">
            <div className="container mx-auto border-y py-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6">
                <h1 className="text-white font-bold text-3xl mb-8 lg:text-4xl">Gift Cards</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {giftCards.length > 0 ? (
                        giftCards.map((card) => (
                            <div key={card.gift_card_id} className="bg-[#0b1739] rounded-2xl p-6 text-white">
                                <h2>Gift Card: {card.code}</h2>
                                <p>Amount: ${card?.amount}</p>
                                <p>Status: {card.status}</p>
                                <button
                                    onClick={() => handlePurchaseClick(card)}
                                    disabled={card.status !== 'active'}
                                    className="bg-grad px-5 py-2 rounded-full mt-4"
                                >
                                    {card.status === 'active' ? 'Purchase' : 'Unavailable'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No gift cards available at the moment.</p>
                    )}
                </div>

                <h1 className="text-white font-bold text-3xl my-8 lg:text-4xl">Your Purchased Gift Cards</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userGiftCards.length > 0 ? (
                        userGiftCards.map((card) => (
                            <div key={card.user_gift_card_id} className="bg-[#0b1739] rounded-2xl p-6 text-white">
                                <h2>Gift Card: {card.code}</h2>
                                <p>Purchased Amount: ${card.amount}</p>
                                <p>Remaining Balance: ${card.remaining_balance}</p>
                                <input
                                    type="number"
                                    placeholder="Amount to redeem"
                                    value={redeemAmount}
                                    onChange={(e) => setRedeemAmount(parseFloat(e.target.value))}
                                    min="0"
                                    max={card.remaining_balance}
                                />
                                <button onClick={() => handleRedeem(card.gift_card_id)}>
                                    Redeem
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>You have no purchased gift cards.</p>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen &&
                <AuthModel onClose={() => setIsPaymentModalOpen(false)}>

                        <PaymentModal
                            isOpen={isPaymentModalOpen}
                            onClose={() => setIsPaymentModalOpen(false)}
                            entity={selectedGiftCard?.gift_card_id}
                            userId={userId}
                            type='gift_card'
                            amount={selectedGiftCard?.amount}
                            onSuccess={handlePaymentSuccess}
                        />
                    </AuthModel>
            }
        </div>
    );
};

export default GiftCardStore;