import { API_URL } from '@/utils/ApiUrl';

export async function GET() {
    try {
        const response = await fetch(`${API_URL}/admin/site-settings/countdown-enabled`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return Response.json({ 
                success: false, 
                enabled: true // Default to enabled if fetch fails
            });
        }

        const data = await response.json();
        
        return Response.json({
            success: true,
            enabled: data.setting?.value === 'true'
        });
    } catch (error) {
        console.error('Error fetching countdown enabled status:', error);
        return Response.json({ 
            success: false, 
            enabled: true // Default to enabled if error occurs
        });
    }
}
