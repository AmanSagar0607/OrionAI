import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  // Connection settings
  retryWrites: true,
  w: 'majority',
  
  // Timeout settings
  connectTimeoutMS: 10000, // 10 seconds
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 20000, // 20 seconds
  
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 10000,
  
  // Network settings
  family: 4, // Force IPv4
  
  // Additional reliability settings
  heartbeatFrequencyMS: 10000,
  retryReads: true,
  waitQueueTimeoutMS: 10000
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection across hot reloads
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // In production mode, avoid using a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Extract database name from URI if not provided in env
const getDatabaseName = (): string => {
  // If MONGODB_DB is set, use it
  if (process.env.MONGODB_DB) {
    return process.env.MONGODB_DB;
  }
  
  // Otherwise, try to extract from connection string
  try {
    const url = new URL(uri);
    // Get the pathname and remove the leading slash
    const dbName = url.pathname.substring(1);
    if (dbName) return dbName;
  } catch (e) {
    console.warn('Could not parse MONGODB_URI for database name');
  }
  
  // Default to 'orian-ai' if nothing else works
  return 'orian-ai';
};

// Export a module-scoped MongoClient promise to be shared across functions
export const connectToDatabase = async () => {
  const databaseName = getDatabaseName();
  
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    
    // Verify the connection with a ping command
    const db = client.db(databaseName);
    await db.command({ ping: 1 });
    
    console.log('Successfully connected to MongoDB');
    
    return { 
      client, 
      db
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error connecting to MongoDB:', {
      error: errorMessage,
      stack: errorStack,
      // Don't log the full URI for security
      uri: process.env.MONGODB_URI ? '***' : 'MONGODB_URI not set',
      database: databaseName
    });
    
    // Provide more helpful error messages for common issues
    if (errorMessage.includes('bad auth') || errorMessage.includes('AuthenticationFailed')) {
      throw new Error('Authentication failed. Please check your MongoDB credentials.');
    } else if (errorMessage.includes('getaddrinfo') || errorMessage.includes('ENOTFOUND')) {
      throw new Error('Could not resolve MongoDB server address. Please check your network connection and server URL.');
    } else if (errorMessage.includes('timed out') || errorMessage.includes('ETIMEDOUT')) {
      throw new Error('Connection to MongoDB timed out. Please check your network connection and try again.');
    } else if (errorMessage.includes('ECONNREFUSED')) {
      throw new Error('Connection refused. Is MongoDB running and accessible?');
    }
    
    throw error;
  }
};

export default clientPromise;
