import { NextResponse } from 'next/server';
import { getSequelize } from '../../../../lib/database';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const sequelize = getSequelize();
    
    // Kiểm tra kết nối database
    await sequelize.authenticate();
    
    // Thực hiện một query đơn giản để kiểm tra database
    const [results] = await sequelize.query('SELECT 1 as test');
    
    const responseTime = Date.now() - startTime;
    
    // Lấy thông tin về memory usage
    const memUsage = process.memoryUsage();
    
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
        database: sequelize.config.database,
        queryTest: results[0].test === 1 ? 'passed' : 'failed'
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: {
          rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
        },
        cpuUsage: process.cpuUsage()
      },
      environment: process.env.NODE_ENV || 'development',
      pid: process.pid
    }, { status: 200 });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: 'disconnected',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      },
      environment: process.env.NODE_ENV || 'development',
      pid: process.pid
    }, { status: 503 });
  }
} 