import { getDbClient, closeDbConnection } from '../lib/db';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Mock the pg Client
jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn().mockResolvedValue(undefined), // Mock successful connect
    end: jest.fn().mockResolvedValue(undefined),     // Mock successful end
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
    originalEnv = process.env;
    jest.clearAllMocks();

    mockClient = {
      connect: jest.fn().mockResolvedValue(undefined), // Mock successful connect
      end: jest.fn().mockResolvedValue(undefined),     // Mock successful end
      query: jest.fn(),
      release: jest.fn(),
    };
    (Client as unknown as jest.Mock).mockImplementation(() => mockClient);
  });

  afterEach(() => {
    process.env = originalEnv;
    closeDbConnection();
  });

  it('should create a new client with correct configuration', async () => {
    process.env.DB_HOST = 'test-host';
    process.env.DB_USER = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_NAME = 'test-db';
    process.env.DB_PORT = '5432';
    process.env.DB_SSL_CA_PATH = '/path/to/cert';

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
    expect(mockClient.connect).toHaveBeenCalledTimes(1); // Ensure connect was called
  });

  it('should reuse existing client on subsequent calls', async () => {
    const client1 = await getDbClient();
    const client2 = await getDbClient();

    expect(client1).toBe(client2);
    expect(Client).toHaveBeenCalledTimes(1);
    expect(mockClient.connect).toHaveBeenCalledTimes(1); // Ensure connect was only called once
  });

  it('should handle connection errors', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockClient.connect.mockRejectedValue(new Error('Connection failed'));

    await expect(getDbClient()).rejects.toThrow('Database connection failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Database connection error');

    consoleErrorSpy.mockRestore();
  });

  it('should close the connection properly', async () => {
    await getDbClient();
    await closeDbConnection();

    expect(mockClient.end).toHaveBeenCalledTimes(1); // Ensure end was called
  });

  it('should handle closing when no client exists', async () => {
    await closeDbConnection();
    // Should not throw any errors
    expect(mockClient.end).not.toHaveBeenCalled(); // Ensure end was not called
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
    expect(mockClient.connect).toHaveBeenCalledTimes(1); // Ensure connect was called
  });

  it('should handle errors during SSL certificate reading', async () => {
    process.env.DB_HOST = 'test-host';
    process.env.DB_USER = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_NAME = 'test-db';
    process.env.DB_PORT = '5432';
    process.env.DB_SSL_CA_PATH = '/path/to/cert';

    const sslError = new Error('Failed to read SSL certificate');
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw sslError;
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // The error is thrown directly from readFileSync, before reaching the try-catch
    await expect(getDbClient()).rejects.toThrow('Failed to read SSL certificate');
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should return existing client without reinitializing', async () => {
    process.env.DB_HOST = 'test-host';
    process.env.DB_USER = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_NAME = 'test-db';
    process.env.DB_PORT = '5432';
    process.env.DB_SSL_CA_PATH = '/path/to/cert';

    // Mock successful SSL certificate reading for initial setup
    (fs.readFileSync as jest.Mock).mockReturnValue('cert-content');

    // First call to initialize the client
    const firstClient = await getDbClient();
    
    // Mock readFileSync to throw an error to prove we're not reinitializing
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Should not be called');
    });

    // Second call should return the same client without reinitializing
    const secondClient = await getDbClient();

    expect(secondClient).toBe(firstClient);
    expect(fs.readFileSync).toHaveBeenCalledTimes(1); // Only called during initial setup
  });

  it('should use default port when DB_PORT is not set', async () => {
    // Store original env and clear DB_PORT
    const originalPort = process.env.DB_PORT;
    delete process.env.DB_PORT;

    process.env.DB_HOST = 'test-host';
    process.env.DB_USER = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_NAME = 'test-db';
    process.env.DB_SSL_CA_PATH = '/path/to/cert';

    // Mock successful SSL certificate reading
    (fs.readFileSync as jest.Mock).mockReturnValue('cert-content');

    await getDbClient();

    expect(Client).toHaveBeenCalledWith({
      host: 'test-host',
      user: 'test-user',
      password: 'test-password',
      database: 'test-db',
      port: 25060, // Default port
      ssl: {
        ca: 'cert-content'
      }
    });

    // Restore original env
    if (originalPort) {
      process.env.DB_PORT = originalPort;
    }
  });
});