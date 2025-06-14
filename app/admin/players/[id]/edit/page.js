'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const STATS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma', 'armorClass', 'initiative', 'speed', 'hitPointMaximum'];

export default function AdminEditPlayerPage() {
    // Usamos el hook useParams para obtener los parámetros de la URL
    const params = useParams();
    // El parámetro se llama 'id' por el nombre de la carpeta [id]
    const userId = params.id;

    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Nos aseguramos de que userId no sea undefined antes de hacer la llamada
        if (typeof userId === 'string' && userId) {
            console.log("Fetching data for user ID:", userId);
            fetch(`/api/admin/players/${userId}`)
                .then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
                        throw new Error(`Error ${res.status}: ${errorData.message || 'Failed to fetch character data'}`);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log("Data received:", data);
                    setCharacter(data);
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (userId) {
            // Si userId existe pero no es un string, puede ser un array, lo cual es un error de enrutamiento
            console.error("Invalid userId parameter received:", userId);
            setError("ID de usuario inválido en la URL.");
            setLoading(false);
        }
        // Si userId es undefined, el useEffect simplemente no se ejecuta hasta que el parámetro esté disponible.
    }, [userId]); // El useEffect se volverá a ejecutar si userId cambia de undefined a un valor real

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

    if (loading) {
        return <p>Cargando datos del jugador...</p>;
    }
    if (error) {
        return <p style={{ color: 'var(--color-failure-red)' }}>{error}</p>;
    }
    if (!character) {
        return <p>No se encontraron datos para este jugador. Es posible que aún no tenga una hoja de personaje creada.</p>;
    }

    return (
        <div className="form-container" style={{ maxWidth: '800px' }}>
            <h2>Editando Hoja de {character.characterName || 'Jugador sin nombre'}</h2>
            <p>Aquí puedes editar los valores base del personaje. Las modificaciones de los jugadores (+n/-n) se mantendrán.</p>
            
            <form onSubmit={handleSave}>
                <h3>Información General</h3>
                <label>Nombre del Personaje</label>
                <input name="characterName" value={character.characterName || ''} onChange={handleInputChange} />
                <label>Clase y Nivel</label>
                <input name="classAndLevel" value={character.classAndLevel || ''} onChange={handleInputChange} />
                <label>Raza</label>
                <input name="race" value={character.race || ''} onChange={handleInputChange} />
                <label>Puntos de Experiencia</label>
                <input name="experiencePoints" type="number" value={character.experiencePoints || 0} onChange={handleInputChange} />
                
                <h3 style={{marginTop: '20px'}}>Estadísticas Base</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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

                <button type="submit" style={{ marginTop: '20px' }}>Guardar Cambios</button>
                {success && <p style={{ color: 'var(--color-success-green)', marginTop: '10px' }}>{success}</p>}
            </form>
        </div>
    );
}
