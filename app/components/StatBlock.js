'use client';

import { useState, useMemo } from 'react';

export default function StatBlock({ label, statName, stat, onUpdate }) {
    const [modValue, setModValue] = useState(1);
    const [modReason, setModReason] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const total = useMemo(() => {
        return (stat?.base || 0) + (stat?.modifications?.reduce((acc, mod) => acc + mod.value, 0) || 0);
    }, [stat]);

    const totalMod = useMemo(() => {
        return stat?.modifications?.reduce((acc, mod) => acc + mod.value, 0) || 0;
    }, [stat]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newModification = { value: Number(modValue), reason: modReason, date: new Date().toISOString() };
        const newModifications = [...(stat.modifications || []), newModification];
        onUpdate({ [statName]: { ...stat, modifications: newModifications } });
        setModValue(1);
        setModReason('');
    };

    if (!stat) return null;

    return (
        <div className="stat-block">
            <div className="stat-header">
                <span>{label}</span>
                <button onClick={() => setShowHistory(!showHistory)} className="history-toggle-btn">
                    {showHistory ? 'Ocultar' : 'Historial'}
                </button>
            </div>
            <div className="stat-value">
                <span className="stat-total">{total}</span>
                <span className="stat-base">({stat.base || 0}
                    {totalMod !== 0 && <span className={totalMod > 0 ? 'mod-pos' : 'mod-neg'}> {totalMod > 0 ? `+${totalMod}` : totalMod}</span>})
                </span>
            </div>
            
            {showHistory && (
                <ul className="history-log">
                    <li><strong>Base:</strong> {stat.base || 0}</li>
                    {(stat.modifications || []).map((mod, index) => (
                        <li key={index}>
                            <span className={mod.value > 0 ? 'mod-pos' : 'mod-neg'}>
                                {mod.value > 0 ? `+${mod.value}` : mod.value}
                            </span>: {mod.reason || 'Sin razón'}
                            <em className="history-date">({new Date(mod.date).toLocaleDateString()})</em>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit} className="stat-mod-form">
                <input
                    type="number"
                    value={modValue}
                    onChange={(e) => setModValue(Number(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="Razón (opcional)"
                    value={modReason}
                    onChange={(e) => setModReason(e.target.value)}
                />
                <button type="submit">Modificar</button>
            </form>
        </div>
    );
}