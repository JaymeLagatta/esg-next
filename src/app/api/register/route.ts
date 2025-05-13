import { NextResponse } from 'next/server'
import sql from 'mssql'

const config = {
    server: '127.0.0.1\\SQLEXPRESS', // Usando IP local
    database: 'esg-next',
    user: 'esg-app',      // Usuário que você criou
    password: '123123!',  // Senha que você definiu
    options: {
        trustServerCertificate: true,
        encrypt: false,    // Importante para conexões locais
        integratedSecurity: false // Desativado para usar autenticação SQL
    }
}

export async function POST(request: Request) {
    try {
        console.log('Tentando conectar ao banco...')

        let pool
        try {
            pool = await sql.connect(config)
            console.log('Conexão estabelecida com sucesso!')
        } catch (err) {
            console.error('Erro na conexão:', err)
            return NextResponse.json(
                { message: 'Falha na conexão com o banco de dados' },
                { status: 500 }
            )
        }

        const formData = await request.json()
        console.log('Dados recebidos:', formData)

        try {
            const result = await pool.request()
                .input('nome', sql.NVarChar, formData.nome)
                .input('email', sql.NVarChar, formData.email)
                .input('senha', sql.NVarChar, formData.senha)
                .input('empresa', sql.NVarChar, formData.empresa || null)
                .input('cargo', sql.NVarChar, formData.cargo || null)
                .input('cep', sql.VarChar, formData.cep || null)
                .input('logradouro', sql.NVarChar, formData.logradouro || null)
                .input('numero', sql.NVarChar, formData.numero || null)
                .input('complemento', sql.NVarChar, formData.complemento || null)
                .input('bairro', sql.NVarChar, formData.bairro || null)
                .input('cidade', sql.NVarChar, formData.cidade || null)
                .input('uf', sql.Char, formData.uf || null)
                .query(`
                    INSERT INTO usuarios (
                        nome, email, senha, empresa, cargo,
                        cep, logradouro, numero, complemento, bairro, cidade, uf, data_cadastro
                    ) VALUES (
                        @nome, @email, @senha, @empresa, @cargo,
                        @cep, @logradouro, @numero, @complemento, @bairro, @cidade, @uf, GETDATE()
                    )
                `)

            console.log('Registro inserido com sucesso!')
            return NextResponse.json({ message: 'Usuário cadastrado com sucesso!' }, { status: 201 })
        } catch (queryErr) {
            console.error('Erro na query:', queryErr)
            return NextResponse.json(
                { message: 'Erro ao executar a query no banco de dados' },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('Erro geral:', error)
        return NextResponse.json(
            { message: 'Erro interno no servidor' },
            { status: 500 }
        )
    }
}