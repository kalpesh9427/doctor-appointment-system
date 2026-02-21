const axios = require('axios');

async function verifyFn() {
    try {
        const response = await axios.post('http://localhost:4000/api/auth/login', {
            email: 'admin@medicare.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Login successful:', response.data.message);
        if (response.data.user.role === 'admin') {
            console.log('Verified: Role is admin');
        } else {
            console.error('Failed: Role is not admin');
            process.exit(1);
        }
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyFn();
