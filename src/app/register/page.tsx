'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
       // empresa: '',
       // cargo: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
    })

    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' }>()

    // Função para buscar CEP
    const fetchCEP = async (cep: string) => {
        try {
            const cleanedCEP = cep.replace(/\D/g, '')
            if (cleanedCEP.length !== 8) return

            const response = await fetch(`https://viacep.com.br/ws/${cleanedCEP}/json/`)
            const data = await response.json()

            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    uf: data.uf
                }))
            } else {
                setMessage({ text: 'CEP não encontrado', type: 'error' })
            }
        } catch (error) {
            setMessage({ text: 'Erro ao buscar CEP', type: 'error' })
            console.error('Erro ao buscar CEP:', error)
        }
    }

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

            if (response.ok) {
                setMessage({ text: result.message, type: 'success' })
                setFormData({
                    nome: '',
                    email: '',
                    senha: '',
                   // empresa: '',
                   // cargo: '',
                    cep: '',
                    logradouro: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    uf: ''
                })
            } else {
                setMessage({ text: result.message || 'Erro no cadastro', type: 'error' })
            }
        } catch (error) {
            setMessage({ text: 'Erro ao conectar com o servidor', type: 'error' })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Cadastro ESG</h1>
                <p className={styles.subtitle}>Junte-se à nossa plataforma de sustentabilidade</p>
            </div>

            <div className={styles.formContainer}>
                {message && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nome" className={styles.label}>Nome Completo</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="senha" className={styles.label}>Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                            className={styles.input}
                            required
                            minLength={6}
                        />
                    </div>

                    {/*<div className={styles.formGroup}>
                        <label htmlFor="empresa" className={styles.label}>Empresa (opcional)</label>
                        <input
                            type="text"
                            id="empresa"
                            name="empresa"
                            value={formData.empresa}
                            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                            className={styles.input}
                        />
                    </>

                    <div className={styles.formGroup}>
                        <label htmlFor="cargo" className={styles.label}>Cargo (opcional)</label>
                        <input
                            type="text"
                            id="cargo"
                            name="cargo"
                            value={formData.cargo}
                            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                            className={styles.input}
                        />
                    </div>*/}

                    {/* Seção de Endereço */}
                    <div className={styles.addressSection}>
                        <h3 className={styles.sectionTitle}>Endereço</h3>

                        <div className={styles.formGroup}>
                            <label htmlFor="cep" className={styles.label}>CEP</label>
                            <input
                                type="text"
                                id="cep"
                                name="cep"
                                value={formData.cep}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setFormData({ ...formData, cep: value })
                                    if (value.replace(/\D/g, '').length === 8) {
                                        fetchCEP(value)
                                    }
                                }}
                                className={styles.input}
                                pattern="\d{5}-?\d{3}"
                                placeholder="00000-000"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="logradouro" className={styles.label}>Logradouro</label>
                            <input
                                type="text"
                                id="logradouro"
                                name="logradouro"
                                value={formData.logradouro}
                                onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={`${styles.formGroup} ${styles.formGroupSmall}`}>
                                <label htmlFor="numero" className={styles.label}>Número</label>
                                <input
                                    type="text"
                                    id="numero"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                    className={styles.input}
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.formGroupLarge}`}>
                                <label htmlFor="complemento" className={styles.label}>Complemento</label>
                                <input
                                    type="text"
                                    id="complemento"
                                    name="complemento"
                                    value={formData.complemento}
                                    onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="bairro" className={styles.label}>Bairro</label>
                            <input
                                type="text"
                                id="bairro"
                                name="bairro"
                                value={formData.bairro}
                                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={`${styles.formGroup} ${styles.formGroupLarge}`}>
                                <label htmlFor="cidade" className={styles.label}>Cidade</label>
                                <input
                                    type="text"
                                    id="cidade"
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                                    className={styles.input}
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.formGroupSmall}`}>
                                <label htmlFor="uf" className={styles.label}>UF</label>
                                <input
                                    type="text"
                                    id="uf"
                                    name="uf"
                                    value={formData.uf}
                                    onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                                    className={styles.input}
                                    maxLength={2}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    )
}