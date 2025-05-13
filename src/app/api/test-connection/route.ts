import { NextResponse } from 'next/server'
import sql from 'mssql'

const config = {
    //server: '127.0.0.1\\SQLEXPRESS', // Usando IP local
    server: 'localhost\\SQLEXPRESS',
    //server: 'localhost',
    database: 'esg-next',
    user: 'esg-app',      // Usuário que você criou
    password: '123123!',  // Senha que você definiu
    options: {
        trustServerCertificate: true,
       // encrypt: false,    // Importante para conexões locais
        //integratedSecurity: false // Desativado para usar autenticação SQL
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

export async function GET() {
    let pool
    try {
        console.log('Tentando conectar com:', {
            server: config.server,
            database: config.database,
            user: config.user
        })

        pool = await sql.connect(config)
        console.log('Conexão estabelecida com sucesso!')

        // Teste simples de query
        const result = await pool.request().query('SELECT 1 as test')
        console.log('Resultado do teste:', result.recordset)

        return NextResponse.json({
            success: true,
            message: 'Conexão e query teste realizadas com sucesso!',
            data: result.recordset
        })
    } catch (err) {
        console.error('Erro detalhado:', {
            message: err.message,
            code: err.code,
            stack: err.stack
        })

        return NextResponse.json(
            {
                success: false,
                error: err.message,
                details: {
                    code: err.code,
                    connectionConfig: {
                        server: config.server,
                        database: config.database,
                        user: config.user
                    }
                }
            },
            { status: 500 }
        )
    } finally {
        if (pool) {
            try {
                await pool.close()
                console.log('Conexão fechada')
            } catch (closeErr) {
                console.error('Erro ao fechar conexão:', closeErr)
            }
        }
    }
}