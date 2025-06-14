'use client';

import { useState, useMemo } from 'react';

const defaultStat = {
    base: 0,
    modifications: []
};

export default function StatEditor({ label, statName, initialStat, onUpdate }) {
    const [stat, setStat] = useState(initialStat || defaultStat);
    const [modValue, setModValue] = useState(1);
    const [modReason, setModReason] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const total = useMemo(() => {
        const baseValue = stat?.base || 0;
        const modsValue = stat?.modifications?.reduce((acc, mod) => acc + mod.value, 0) || 0;
        return baseValue + modsValue;
    }, [stat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!modReason.trim()) {
            alert('Por favor, introduce una razón para la modificación.');
            return;
        }

        // RUTA CORREGIDA: Apuntamos a la URL correcta de la API
        const res = await fetch('/api/character/update-stat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statName, value: modValue, reason: modReason }),
        });

        if (res.ok) {
            const updatedStat = await res.json();
            setStat(updatedStat);
            onUpdate(statName, updatedStat);
            setModValue(1);
            setModReason('');
        } else {
            alert('Error al actualizar la estadística.');
        }
    };

    if (!stat) return null;

    return (
        <div className="stat-block">
            <div className="stat-header">
                <span>{label}</span>
                <button onClick={() => setShowHistory(!showHistory)} style={{width: 'auto', fontSize: '0.8rem', padding: '5px'}}>
                    {showHistory ? 'Ocultar Historial' : 'Ver Historial'}
                </button>
            </div>
            <div className="stat-value">
                {stat.base || 0}
                {(stat.modifications || []).map((mod, index) => (
                    <span key={index} className={`stat-mod ${mod.value > 0 ? 'mod-pos' : 'mod-neg'}`}>
                        {mod.value > 0 ? `+${mod.value}` : mod.value}
                    </span>
                ))}
                <span className="stat-total">({total})</span>
            </div>
            
            {showHistory && (
                <ul className="history-log">
                    <li><strong>Base:</strong> {stat.base || 0}</li>
                    {(stat.modifications || []).map((mod, index) => (
                        <li key={index}>
                            <span className={mod.value > 0 ? 'mod-pos' : 'mod-neg'}>
                                {mod.value > 0 ? `+${mod.value}` : mod.value}
                            </span>: {mod.reason} 
                            <em style={{fontSize: '0.8em', marginLeft: '5px'}}>({new Date(mod.date).toLocaleDateString()})</em>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit} style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    value={modValue}
                    onChange={(e) => setModValue(Number(e.target.value))}
                    style={{ flex: 1 }}
                />
                <input
                    type="text"
                    placeholder="Razón (ej: Poción de Fuerza)"
                    value={modReason}
                    onChange={(e) => setModReason(e.target.value)}
                    style={{ flex: 3 }}
                />
                <button type="submit" style={{ flex: 1 }}>Modificar</button>
            </form>
        </div>
    );
}
