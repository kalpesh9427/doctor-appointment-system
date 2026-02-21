const bcrypt = require('bcrypt');

// Hash the password 'password123'
bcrypt.hash('password123', 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password for "password123":', hash);
});