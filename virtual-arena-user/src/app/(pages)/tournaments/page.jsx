'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import MainLayout from '@/app/components/MainLayout';
import { useTranslation } from '@/app/hooks/useTranslation';
import { API_URL } from '@/utils/ApiUrl';
import PaymentOptionsModal from '@/app/components/PaymentOptionsModal';
import AuthModal from '@/app/components/AuthModal';
import { formatDisplayPrice } from '@/app/utils/currency';
import SEOHead from '@/app/components/SEOHead';


const TournamentsPage = () => {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = useTranslation(locale);

  const [tournaments, setTournaments] = useState([]);
  const [pastTournaments, setPastTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const { isAuthenticated, registrations } = useSelector(state => state.userData);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/get-tournaments`);

        // Add default rules and requirements to tournaments that don't have them
        const tournamentsWithRules = (response.data.tournaments || []).map(tournament => ({
          ...tournament,
          rules: tournament.rules || [
            'All participants must be 13 years or older',
            'Valid government-issued ID required for registration',
            'Players must use provided VR equipment only',
            'Unsportsmanlike conduct will result in disqualification',
            'Tournament organizers\' decisions are final'
          ],
          requirements: tournament.requirements || [
            'Signed waiver form mandatory',
            'Comfortable clothing recommended',
            'No loose jewelry or accessories',
            'Arrive 30 minutes before scheduled match time',
            'Motion sickness tolerance recommended'
          ]
        }));

        setTournaments(tournamentsWithRules);

        // Mock past tournaments data
        const mockPastTournaments = [
          {
            tournament_id: 'past-1',
            name: 'VR Arena Championship 2024',
            description: 'Epic VR battle royale tournament with 64 players competing for the ultimate prize.',
            start_date: '2024-06-15T10:00:00Z',
            end_date: '2024-06-15T18:00:00Z',
            city: 'Edmonton',
            state: 'AB',
            ticket_price: 25.00,
            prize_pool: 2500.00,
            max_participants: 64,
            registered_count: 64,
            game_type: 'Battle Royale',
            status: 'completed',
            winner: 'ProGamer2024',
            placement: '1st Place',
            prize_won: 1000.00,
            rules: [
              'All participants must be 13 years or older',
              'No outside assistance or coaching during matches',
              'Players must use provided VR equipment only',
              'Unsportsmanlike conduct will result in disqualification',
              'Tournament organizers\' decisions are final'
            ],
            requirements: [
              'Valid government-issued ID required',
              'Signed waiver form mandatory',
              'Comfortable clothing recommended',
              'No loose jewelry or accessories',
              'Arrive 30 minutes before scheduled match time'
            ],
            gallery: [
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
              'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
              'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400'
            ]
          },
          {
            tournament_id: 'past-2',
            name: 'Beat Saber Masters',
            description: 'Rhythm VR tournament featuring the best Beat Saber players in Western Canada.',
            start_date: '2024-05-20T14:00:00Z',
            end_date: '2024-05-20T20:00:00Z',
            city: 'Edmonton',
            state: 'AB',
            ticket_price: 15.00,
            prize_pool: 1200.00,
            max_participants: 32,
            registered_count: 32,
            game_type: 'Rhythm',
            status: 'completed',
            winner: 'RhythmMaster',
            placement: '1st Place',
            prize_won: 600.00,
            rules: [
              'Minimum age requirement: 10 years old',
              'Players must complete practice session before tournament',
              'No custom songs allowed - official playlist only',
              'Three strikes rule: 3 missed beats = elimination',
              'Respect other players and equipment'
            ],
            requirements: [
              'Comfortable athletic wear required',
              'Hair must be tied back if long',
              'No food or drinks in play area',
              'Parent/guardian consent for minors',
              'Check-in 15 minutes before start time'
            ],
            gallery: [
              'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400',
              'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400',
              'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400'
            ]
          },
          {
            tournament_id: 'past-3',
            name: 'VR Racing Grand Prix',
            description: 'High-speed VR racing tournament with realistic physics and stunning graphics.',
            start_date: '2024-04-10T12:00:00Z',
            end_date: '2024-04-10T17:00:00Z',
            city: 'Edmonton',
            state: 'AB',
            ticket_price: 20.00,
            prize_pool: 1800.00,
            max_participants: 24,
            registered_count: 24,
            game_type: 'Racing',
            status: 'completed',
            winner: 'SpeedDemon',
            placement: '1st Place',
            prize_won: 800.00,
            rules: [
              'Age requirement: 16 years or older',
              'No ramming or unsportsmanlike driving',
              'Follow track rules and racing etiquette',
              'Penalties for cutting corners or cheating',
              'Final lap determines winner'
            ],
            requirements: [
              'Motion sickness tolerance recommended',
              'Comfortable seating position required',
              'No loose items in pockets',
              'Racing experience helpful but not required',
              'Arrive 20 minutes early for briefing'
            ],
            gallery: [
              'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
              'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
            ]
          }
        ];

        setPastTournaments(mockPastTournaments);
      } catch (err) {
        setError('Error fetching tournaments');
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []); // Empty dependency array - only run once on mount

  const handleRegisterClick = (tournament) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (registrations?.includes(tournament?.tournament_id)) {
      toast.error(t.alreadyRegistered || "You have already registered for this tournament");
      return;
    }

    // Show payment options instead of directly registering
    setSelectedTournament(tournament);
    setShowPaymentOptions(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      upcoming: t.upcoming || 'Upcoming',
      ongoing: t.ongoing || 'Ongoing',
      completed: t.completed || 'Completed',
      cancelled: t.cancelled || 'Cancelled'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <MainLayout title={t.tournaments || 'Tournaments'}>
        <div className="w-full px-2 md:px-8 py-8 min-h-[60vh] bg-blackish">
          <div className="text-center text-white">{t.common?.loading || 'Loading...'}</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title={t.tournaments || 'Tournaments'}>
        <div className="w-full px-2 md:px-8 py-8 min-h-[60vh] bg-blackish">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t.tournaments || 'Tournaments'}>
      <SEOHead page="tournaments" locale={locale} />
      <div className="w-full px-2 md:px-8 py-8 min-h-[60vh] bg-blackish">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-wrap-balance">
            {t.tournaments || 'Tournaments'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-wrap-balance">
            {t.tournamentsDescription || 'Compete in exciting VR tournaments and win amazing prizes. Join players from around the world in epic gaming competitions.'}
          </p>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center text-white py-12">
            <h2 className="text-2xl font-semibold mb-4 text-wrap-balance">
              {t.noTournamentsAvailable || 'No tournaments available at the moment'}
            </h2>
            <p className="text-gray-300 text-wrap-balance">
              {t.checkBackForTournaments || 'Check back soon for upcoming tournaments and competitions!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament) => (
              <div key={tournament.tournament_id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Tournament Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white text-wrap-balance">
                      {tournament.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                      {getStatusText(tournament.status)}
                    </span>
                  </div>

                  {tournament.description && (
                    <p className="text-gray-300 mb-4 text-wrap-balance">
                      {tournament.description}
                    </p>
                  )}

                  {/* Tournament Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t.startDate || 'Start Date'}:</span>
                      <span className="text-white">{formatDate(tournament.start_date)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">{t.endDate || 'End Date'}:</span>
                      <span className="text-white">{formatDate(tournament.end_date)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">{t.location || 'Location'}:</span>
                      <span className="text-white">{tournament.city}, {tournament.state}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">{t.entryFee || 'Entry Fee'}:</span>
                      <span className="text-white font-semibold">
                        {formatDisplayPrice(tournament.ticket_price, locale)}
                      </span>
                    </div>

                    {tournament.prize_pool && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.prizePool || 'Prize Pool'}:</span>
                        <span className="text-green-400 font-semibold">
                          {formatDisplayPrice(tournament.prize_pool, locale)}
                        </span>
                      </div>
                    )}

                    {tournament.max_participants && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.participants || 'Participants'}:</span>
                        <span className="text-white">
                          {tournament.registered_count || 0} / {tournament.max_participants}
                        </span>
                      </div>
                    )}

                    {tournament.game_type && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.gameType || 'Game Type'}:</span>
                        <span className="text-white">{tournament.game_type}</span>
                      </div>
                    )}
                  </div>

                  {/* Tournament Rules & Requirements */}
                  {(tournament.rules || tournament.requirements) && (
                    <div className="mb-6">
                      <h4 className="text-white font-semibold text-lg mb-3">{t.rulesAndRequirements}</h4>

                      {tournament.rules && Array.isArray(tournament.rules) && tournament.rules.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-gray-300 font-medium mb-2">{t.tournamentRules}:</h5>
                          <ul className="text-gray-400 text-sm space-y-1">
                            {tournament.rules.map((rule, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-[#DB1FEB] mr-2">•</span>
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {tournament.requirements && Array.isArray(tournament.requirements) && tournament.requirements.length > 0 && (
                        <div>
                          <h5 className="text-gray-300 font-medium mb-2">{t.tournamentRequirements}:</h5>
                          <ul className="text-gray-400 text-sm space-y-1">
                            {tournament.requirements.map((requirement, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-[#DB1FEB] mr-2">•</span>
                                <span>{requirement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  {tournament.status === 'upcoming' && (
                    <button
                      onClick={() => handleRegisterClick(tournament)}
                      disabled={tournament.max_participants && tournament.registered_count >= tournament.max_participants}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                        tournament.max_participants && tournament.registered_count >= tournament.max_participants
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : registrations?.includes(tournament.tournament_id)
                          ? 'bg-green-600 text-white cursor-default'
                          : 'bg-grad text-white hover:opacity-90'
                      }`}
                    >
                      {tournament.max_participants && tournament.registered_count >= tournament.max_participants
                        ? t.tournamentFull || 'Tournament Full'
                        : registrations?.includes(tournament.tournament_id)
                        ? t.registered || 'Registered'
                        : t.register || 'Register Now'
                      }
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Past Tournaments Section */}
        {pastTournaments.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.pastTournaments || 'Past Tournaments'}
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t.pastTournamentsDescription || 'Check out the results and highlights from our previous tournaments.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastTournaments.map((tournament) => (
                <div key={tournament.tournament_id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Tournament Gallery */}
                  {tournament.gallery && tournament.gallery.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={tournament.gallery[0]}
                        alt={tournament.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                          {getStatusText(tournament.status)}
                        </span>
                      </div>
                      {tournament.gallery.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          +{tournament.gallery.length - 1} {t.morePhotos || 'more photos'}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {tournament.name}
                    </h3>

                    {tournament.description && (
                      <p className="text-gray-300 mb-4 text-sm">
                        {tournament.description}
                      </p>
                    )}

                    {/* Tournament Results */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.date || 'Date'}:</span>
                        <span className="text-white text-sm">{formatDate(tournament.start_date)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.winner || 'Winner'}:</span>
                        <span className="text-yellow-400 font-semibold">{tournament.winner}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.prizeWon || 'Prize Won'}:</span>
                        <span className="text-green-400 font-semibold">
                          {formatDisplayPrice(tournament.prize_won, locale)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.participants || 'Participants'}:</span>
                        <span className="text-white">{tournament.registered_count}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">{t.gameType || 'Game Type'}:</span>
                        <span className="text-white">{tournament.game_type}</span>
                      </div>
                    </div>

                    {/* View Gallery Button */}
                    {tournament.gallery && tournament.gallery.length > 0 && (
                      <button className="w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white">
                        {t.viewGallery || 'View Gallery'} ({tournament.gallery.length} {t.photos || 'photos'})
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Options Modal */}
        {showPaymentOptions && selectedTournament && (
          <PaymentOptionsModal
            isOpen={showPaymentOptions}
            onClose={() => setShowPaymentOptions(false)}
            tournament={selectedTournament}
            type="tournament"
          />
        )}

        {/* Auth Modal */}
        {showLogin && (
          <AuthModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default TournamentsPage;
