// test-db-connection.ts
import * as sql from 'mssql';
import 'dotenv/config'; // Make sure dotenv is loaded to read .env file

async function testConnection() {
  const config: sql.config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    options: {
      instanceName: process.env.DB_INSTANCE,
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
      // Keep port here, though instanceName might take precedence
      port: parseInt(process.env.DB_PORT || '1433', 10), // Ensure port is number
    },
  };

  console.log('Attempting direct mssql connection with config:', config);

  try {
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('Direct mssql connection successful!');

    // Optional: Run a simple query to confirm full connectivity
    const result = await pool.request().query('SELECT GETDATE() AS CurrentDateTime');
    console.log('Query Result:', result.recordset[0].CurrentDateTime);

    await pool.close();
    console.log('Connection closed.');
  } catch (err: any) {
    console.error('Direct mssql connection failed:');
    console.error('  Error Message:', err.message);
    console.error('  Error Code:', err.code); // Look for an 'ELOGIN' code here too
    console.error('  Full Error Object:', err); // Log the full object for maximum detail
  }
}

testConnection();