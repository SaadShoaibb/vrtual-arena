import { NextResponse } from 'next/server';
import { API_URL } from '@/utils/ApiUrl';

export async function GET() {
    try {
        const response = await fetch(`${API_URL}/admin/site-settings/grand-opening-date`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch countdown date');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching countdown date:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch countdown date' },
            { status: 500 }
        );
    }
}
