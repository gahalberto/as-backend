import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import siteRoutes from './routes/site';
import adminRoutes from './routes/admin';
import { requestIntercepter } from './utils/requestIntercepter';
import fs from 'fs';
import { create } from 'domain';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`🚀 Runnind at PORT ${port}`);
    });
}

app.all('*', requestIntercepter);

app.use('/', siteRoutes);
app.use('/admin', adminRoutes);

const regularServer = http.createServer(app);
if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string)
    }

    const secServer = https.createServer(options, app);
    runServer(80, regularServer);
    runServer(443, secServer);

} else {
    const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
    runServer(serverPort, regularServer);
}