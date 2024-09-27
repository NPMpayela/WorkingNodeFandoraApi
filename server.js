const PORT = 4659; // http://localhost:4659
const http = require('http');
const fs = require('fs');
const express = require('express');
const app = require('./index'); // Assuming './index' is your main Express app
//const app1 = require('./Auth/user'); // Assuming './Auth/user' is another Express app or middleware


// Create an HTTPS server
const server = http.createServer({
    key: fs.readFileSync('Keys/privatekey.pem'),
    cert: fs.readFileSync('Keys/certificate.pem')
}, app);

// Use `app1` as middleware for the app if needed
// You might need to use `app.use()` to integrate `app1` into `app`:
//app.use('/auth', app1); // This will mount `app1` at /auth endpoint

const { connect } = require('./db/db.js');
connect();

server.listen(PORT, () => {
    const now = new Date();
    const current = now.toDateString();
    console.log(`Server started on Port: ${PORT} @ ${current}`);
});
