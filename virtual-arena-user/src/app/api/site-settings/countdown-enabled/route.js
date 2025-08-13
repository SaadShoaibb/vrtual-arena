import { API_URL } from '@/utils/ApiUrl';

export async function GET() {
    try {
        console.log('🔄 Frontend API: Fetching countdown enabled status from backend...');

        const response = await fetch(`${API_URL}/admin/site-settings/countdown_enabled?t=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
        });

        console.log('🔘 Backend response status:', response.status);

        if (!response.ok) {
            console.log('⚠️ Backend fetch failed, defaulting to enabled');
            return Response.json({
                success: false,
                enabled: true // Default to enabled if fetch fails
            });
        }

        const data = await response.json();
        console.log('🔘 Backend response data:', data);

        const enabled = data.setting?.setting_value === 'true';
        console.log('🔘 Parsed enabled status:', enabled);

        // Add cache-busting headers to the response
        const headers = new Headers();
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');

        return Response.json({
            success: true,
            enabled: enabled
        }, { headers });
    } catch (error) {
        console.error('❌ Error fetching countdown enabled status:', error);
        return Response.json({
            success: false,
            enabled: true // Default to enabled if error occurs
        });
    }
}
