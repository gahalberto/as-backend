import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import siteRoutes from './routes/site';
import adminRoutes from './routes/admin';
import { requestIntercepter } from './utils/requestIntercepter';
import fs from 'fs';

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Function to run the server
const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`🚀 Running at PORT ${port}`);
    });
}

// Intercept all requests
app.all('*', requestIntercepter);

// Set up routes
app.use('/', siteRoutes);
app.use('/admin', adminRoutes);

// Create regular HTTP server
const regularServer = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
    // Read SSL key and certificate for HTTPS server
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string)
    }

    // Create HTTPS server
    const secServer = https.createServer(options, app);

    // Run both HTTP and HTTPS servers
    runServer(80, regularServer);
    runServer(443, secServer);

} else {
    // Use port from environment variable or default to 9000
    const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
    runServer(serverPort, regularServer);
}
