import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Create a single connection pool that can be reused
let client: Client | null = null;

export async function getDbClient() {
    const caCertPath = process.env.DB_SSL_CA_PATH || path.join(process.cwd(), "certs", "digitalOcean-ca-certificate.crt");

    if (!client) {
        client = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || "25060"),
            ssl: {
                ca: fs.readFileSync(caCertPath).toString()
            }
        });

        try {
            await client.connect();
        } catch (error) {
            console.error('Database connection error');
            throw new Error('Database connection failed');
        }
    }
    return client;
}

export async function closeDbConnection() {
    if (client) {
        await client.end();
        client = null;
    }
} 