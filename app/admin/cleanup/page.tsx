'use client'

import { useEffect, useState } from 'react'

export default function CleanupPage() {
    const [status, setStatus] = useState('Iniciando limpeza...')

    useEffect(() => {
        async function runCleanup() {
            try {
                const response = await fetch('/api/admin/cleanup', { method: 'POST' })
                const data = await response.json()
                setStatus(JSON.stringify(data, null, 2))
            } catch (err) {
                setStatus('Erro: ' + err.message)
            }
        }
        runCleanup()
    }, [])

    return <pre>{status}</pre>
}
