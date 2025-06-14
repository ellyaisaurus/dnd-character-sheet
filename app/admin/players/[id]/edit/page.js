'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const STATS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma', 'armorClass', 'initiative', 'speed', 'hitPointMaximum'];

export default function AdminEditPlayerPage() {
    const params = useParams();
    const userId = params.id;

    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (typeof userId === 'string' && userId) {
            fetch(`/api/admin/players/${userId}`)
                .then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
                        throw new Error(`Error ${res.status}: ${errorData.message || 'Failed to fetch character data'}`);
                    }
                    return res.json();
                })
                .then(data => setCharacter(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        } else if (userId) {
            setError("ID de usuario inválido en la URL.");
            setLoading(false);
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;

        if (name.includes('.')) {
            const [statName, field] = name.split('.');
            setCharacter(prev => ({
                ...prev,
                [statName]: {
                    ...prev[statName],
                    [field]: val
                }
            }));
        } else {
            setCharacter(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const res = await fetch(`/api/admin/players/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character),
        });

        if (res.ok) {
            setSuccess('¡Personaje actualizado con éxito!');
            setTimeout(() => setSuccess(''), 3000);
        } else {
            const data = await res.json();
            setError(data.message || 'Error al actualizar el personaje.');
        }
    };

    if (loading) return <p>Cargando datos del jugador...</p>;
    if (error) return <p style={{ color: 'var(--color-failure-red)' }}>{error}</p>;
    if (!character) return <p>No se encontraron datos para este jugador.</p>;

    return (
        <div className="form-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2>Editando Hoja de {character.characterName || 'Jugador sin nombre'}</h2>
            <p>Aquí puedes editar los valores base del personaje. Las modificaciones de los jugadores (+n/-n) se mantendrán.</p>
            
            <form onSubmit={handleSave}>
                <h3>Información General</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label>Nombre del Personaje</label>
                        <input name="characterName" value={character.characterName || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Clase y Nivel</label>
                        <input name="classAndLevel" value={character.classAndLevel || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Raza</label>
                        <input name="race" value={character.race || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Puntos de Experiencia</label>
                        <input name="experiencePoints" type="number" value={character.experiencePoints || 0} onChange={handleInputChange} />
                    </div>
                </div>
                
                <h3 style={{marginTop: '30px'}}>Estadísticas Base</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {STATS.map(stat => (
                        <div key={stat}>
                            <label style={{textTransform: 'capitalize'}}>{stat} (Base)</label>
                            <input 
                                name={`${stat}.base`} 
                                type="number" 
                                value={character[stat]?.base || 0} 
                                onChange={handleInputChange} 
                            />
                        </div>
                    ))}
                </div>

                <button type="submit" style={{ marginTop: '30px', width: '100%' }}>Guardar Cambios</button>
                {success && <p style={{ color: 'var(--color-success-green)', marginTop: '10px', textAlign: 'center' }}>{success}</p>}
            </form>
        </div>
    );
}