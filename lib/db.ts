import { Pool, QueryResult } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test database connection on startup
pool.on('connect', (client) => {
  console.log('✅ New database client connected to pool')
})

pool.on('error', (err, client) => {
  process.exit(-1)
})

// Test initial connection
pool.connect()
  .then(client => {
    console.log('✅ Database connection pool initialized successfully')
    client.release()
  })
  .catch(err => {
    console.error('Stack:', err.stack)
  })

export const query = async <T = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now()
  let client
  
  try {
    client = await pool.connect()
    

    
    const result = await client.query<T>(text, params)
    const duration = Date.now() - start
    
    
    return result
  } catch (error: any) {
    const duration = Date.now() - start
    console.error('❌ Database query error:', {
      error: error.message,
      code: error.code,
      detail: error.detail,
      duration: `${duration}ms`,
      query: text.substring(0, 100),
      params: params
    })
    throw error
  } finally {
    if (client) {
      client.release()    }
  }
}

export const transaction = async <T>(
  callback: (client: any) => Promise<T>
): Promise<T> => {
  const client = await pool.connect()
  console.log('🔄 Starting database transaction...')
  
  try {
    await client.query('BEGIN')
    console.log('✅ Transaction BEGIN')
    
    const result = await callback(client)
    
    await client.query('COMMIT')
    console.log('✅ Transaction COMMIT')
    
    return result
  } catch (error: any) {
    await client.query('ROLLBACK')
    console.error('❌ Transaction ROLLBACK:', error.message)
    throw error
  } finally {
    client.release()
    console.log('🔓 Transaction client released')
  }
}

// Health check function
export const checkConnection = async (): Promise<boolean> => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version')

    return true
  } catch (error: any) {
    console.error('❌ Database health check failed:', error.message)
    return false
  }
}

// Periodic health check (every 5 minutes)
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000 // 5 minutes
let healthCheckTimer: NodeJS.Timeout | null = null

const startPeriodicHealthCheck = () => {
  if (healthCheckTimer) {
    clearInterval(healthCheckTimer)
  }
  
  console.log('🏥 Starting periodic database health checks (every 5 minutes)...')
  
  healthCheckTimer = setInterval(async () => {
    console.log('🏥 Running periodic database health check...')
    const isHealthy = await checkConnection()
    if (!isHealthy) {
      console.error('⚠️ Periodic health check failed - database may be down!')
    }
  }, HEALTH_CHECK_INTERVAL)
}

// Start periodic health checks
startPeriodicHealthCheck()

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, closing database pool...')
  if (healthCheckTimer) {
    clearInterval(healthCheckTimer)
  }
  await pool.end()
  console.log('✅ Database pool closed')
})

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, closing database pool...')
  if (healthCheckTimer) {
    clearInterval(healthCheckTimer)
  }
  await pool.end()
  console.log('✅ Database pool closed')
})

export { pool }