import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI; //I can add local mongodb url here for later
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error:`, error.message);
    throw error;
  }
}

export function getDBStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const readyState = mongoose.connection.readyState;
  return {
    state: states[readyState] || 'unknown',
    isConnected: readyState === 1,
    host: mongoose.connection.host || 'localhost',
    port: mongoose.connection.port || 27017,
    dbName: mongoose.connection.name || 'antarctic_digital_twin'
  };
}
