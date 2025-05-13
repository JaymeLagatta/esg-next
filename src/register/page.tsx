'use client'

import { useState } from 'react'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            alert(result.message)
        } catch (error) {
            alert('Erro ao cadastrar')
        }
    }

    return (
        <div>
            <h1>Cadastro de Usuário</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    )
}