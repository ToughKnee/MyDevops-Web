import { getDbClient, closeDbConnection } from '../lib/db';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Mock the pg Client
jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    end: jest.fn(),
    query: jest.fn(),
    release: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

// Mock fs
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('Database Connection', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let mockClient: any;

  beforeEach(() => {
    // Store original environment variables
    originalEnv = process.env;
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a new mock client for each test
    mockClient = {
      connect: jest.fn(),
      end: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    };
    (Client as unknown as jest.Mock).mockImplementation(() => mockClient);
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
    // Reset the client
    closeDbConnection();
  });

  it('should create a new client with correct configuration', async () => {
    // Setup environment variables
    process.env.DB_HOST = 'test-host';
    process.env.DB_USER = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_NAME = 'test-db';
    process.env.DB_PORT = '5432';
    process.env.DB_SSL_CA_PATH = '/path/to/cert';

    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock).mockReturnValue('cert-content');

    await getDbClient();

    expect(Client).toHaveBeenCalledWith({
      host: 'test-host',
      user: 'test-user',
      password: 'test-password',
      database: 'test-db',
      port: 5432,
      ssl: {
        ca: 'cert-content'
      }
    });
  });

  it('should reuse existing client on subsequent calls', async () => {
    const client1 = await getDbClient();
    const client2 = await getDbClient();

    expect(client1).toBe(client2);
    expect(Client).toHaveBeenCalledTimes(1);
  });

  it('should handle connection errors', async () => {
    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockClient.connect.mockRejectedValue(new Error('Connection failed'));

    await expect(getDbClient()).rejects.toThrow('Database connection failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Database connection error');
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should close the connection properly', async () => {
    await getDbClient();
    await closeDbConnection();

    expect(mockClient.end).toHaveBeenCalled();
  });

  it('should handle closing when no client exists', async () => {
    await closeDbConnection();
    // Should not throw any errors
  });

  it('should use default SSL certificate path when not specified', async () => {
    process.env.DB_HOST = 'test-host';
    process.env.DB_USER = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_NAME = 'test-db';
    process.env.DB_PORT = '5432';
    delete process.env.DB_SSL_CA_PATH;

    const expectedPath = path.join(process.cwd(), "certs", "digitalOcean-ca-certificate.crt");
    (fs.readFileSync as jest.Mock).mockReturnValue('cert-content');

    await getDbClient();

    expect(fs.readFileSync).toHaveBeenCalledWith(expectedPath);
  });
}); 