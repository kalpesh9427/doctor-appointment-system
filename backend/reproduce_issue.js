
async function testAdminFlow() {
    try {
        const API_URL = 'http://localhost:5000/api';

        console.log('1. Attempting Admin Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@medicare.com',
                password: 'admin123'
            })
        });

        console.log('Login Status:', loginRes.status);
        const loginData = await loginRes.json();
        console.log('Login Message:', loginData.message);

        if (!loginData.token) {
            console.error('No token received!');
            return;
        }

        const token = loginData.token;
        console.log('Token received.');

        console.log('\n2. Fetching Admin Doctors...');
        try {
            const doctorsRes = await fetch(`${API_URL}/admin/doctors`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Doctors Fetch Status:', doctorsRes.status);
            const doctorsData = await doctorsRes.json();
            console.log('Doctors Data:', JSON.stringify(doctorsData, null, 2));

        } catch (docError) {
            console.error('Error fetching doctors:', docError);
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
    }
}

testAdminFlow();
