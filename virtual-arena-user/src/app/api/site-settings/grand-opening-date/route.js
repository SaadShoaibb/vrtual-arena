import { NextResponse } from 'next/server';
import { API_URL } from '@/utils/ApiUrl';

export async function GET() {
    try {
        console.log('🔄 Frontend API: Fetching countdown date from backend...');

        const response = await fetch(`${API_URL}/admin/site-settings/grand_opening_date?t=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
        });

        console.log('📅 Backend response status:', response.status);

        if (!response.ok) {
            throw new Error(`Failed to fetch countdown date: ${response.status}`);
        }

        const data = await response.json();
        console.log('📅 Backend response data:', data);

        // Add cache-busting headers to the response
        const headers = new Headers();
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');

        return NextResponse.json(data, { headers });
    } catch (error) {
        console.error('❌ Error fetching countdown date:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch countdown date' },
            { status: 500 }
        );
    }
}
