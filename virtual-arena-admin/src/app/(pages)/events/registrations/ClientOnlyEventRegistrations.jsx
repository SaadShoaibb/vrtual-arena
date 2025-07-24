'use client'
import dynamic from 'next/dynamic';

// Dynamically import the EventRegistrations component with no SSR
const EventRegistrations = dynamic(() => import('./EventRegistrations'), {
    ssr: false,
    loading: () => (
        <div className="p-2 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gradiant">Event Registrations</h1>
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading event registrations...</div>
            </div>
        </div>
    )
});

export default EventRegistrations;
