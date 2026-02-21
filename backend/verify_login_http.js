const http = require('http');

const data = JSON.stringify({
    email: 'admin@medicare.com',
    password: 'admin123',
    role: 'admin'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        try {
            const json = JSON.parse(body);
            console.log('Response:', json);
            if (res.statusCode === 200 && json.user && json.user.role === 'admin') {
                console.log('SUCCESS: Admin login verified.');
            } else {
                console.error('FAILURE: Admin login failed or role mismatch.');
                process.exit(1);
            }
        } catch (e) {
            console.error('Error parsing response:', body);
            process.exit(1);
        }
    });
});

req.on('error', error => {
    console.error('Request error:', error);
    process.exit(1);
});

req.write(data);
req.end();
