import mysql from 'mysql2/promise';

// Prevents hot-reload in development from spawning multiple connection pools
const globalForDb = globalThis as unknown as {
  connPool: mysql.Pool | undefined;
};

export const pool =
  globalForDb.connPool ??
  mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartfarm_db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.connPool = pool;
}

/**
 * Executes a raw SQL query with parameters and returns the results.
 * 
 * @example
 * const products = await query('SELECT * FROM products WHERE category_id = ?', [1]);
 */
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const [results] = await pool.execute(sql, params);
  return results as T;
}
