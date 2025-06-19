import { NextResponse } from 'next/server';
import { sequelize } from '../../../lib/database';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Kiểm tra kết nối database
    await sequelize.authenticate();
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      database: {
        status: 'connected',
        dialect: sequelize.getDialect(),
        host: sequelize.config.host,
        port: sequelize.config.port,
        database: sequelize.config.database
      },
      environment: process.env.NODE_ENV || 'development',
      version: process.version
    }, { status: 200 });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: 'disconnected',
        error: error.message
      },
      environment: process.env.NODE_ENV || 'development',
      version: process.version
    }, { status: 503 });
  }
} 