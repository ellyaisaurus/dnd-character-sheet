// app/admin/players/[id]/edit/page.js
// --- CÓDIGO CORREGIDO ---

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import isEqual from 'lodash/isEqual';
// --- RUTAS DE IMPORTACIÓN CORREGIDAS ---
import { calculateAbilityModifiers } from '@/app/utils/character-utils';
import CharacterPageMain from '@/app/components/CharacterPageMain';
import CharacterPageBackstory from '@/app/components/CharacterPageBackstory';
import CharacterPageSpells from '@/app/components/CharacterPageSpells';
import EditableField from '@/app/components/EditableField';
// --- FIN DE CORRECCIÓN DE RUTAS ---

export default function AdminEditPlayerPage() {
    const params = useParams();
    const userId = params.id;

    const [originalCharacter, setOriginalCharacter] = useState(null);
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('main');

    const isDirty = useMemo(() => {
        if (!originalCharacter || !character) return false;
        return !isEqual(originalCharacter, character);
    }, [originalCharacter, character]);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            fetch(`/api/admin/players/${userId}`)
                .then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({ message: 'Error al obtener los datos del personaje.' }));
                        throw new Error(errorData.message);
                    }
                    return res.json();
                })
                .then(data => {
                    setOriginalCharacter(data);
                    setCharacter(data);
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [userId]);

    const handleUpdate = (updatedFields) => {
        setCharacter(prev => ({ ...prev, ...updatedFields }));
    };

    const handleSave = async () => {
        if (!isDirty) return;
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`/api/admin/players/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(character),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Error al guardar los cambios.');
            }
            const savedCharacter = await res.json();
            setOriginalCharacter(savedCharacter.character);
            setCharacter(savedCharacter.character);
            setSuccess('¡Hoja actualizada con éxito!');
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const abilityModifiers = useMemo(() => calculateAbilityModifiers(character), [character]);

    if (loading) return <p>Cargando datos del jugador...</p>;
    if (error && !character) return <p style={{ color: 'var(--color-failure-red)' }}>Error: {error}</p>;
    if (!character) return <p>No se encontraron datos de personaje para este jugador.</p>;

    return (
        <div>
            <div className="save-bar">
                <span>{isDirty ? 'Hay cambios sin guardar.' : 'Todos los cambios guardados.'}</span>
                {error && <span style={{ color: 'var(--color-failure-red)', marginLeft: '20px' }}>{error}</span>}
                {success && <span style={{ color: 'var(--color-success-green)', marginLeft: '20px' }}>{success}</span>}
                <button onClick={handleSave} disabled={!isDirty || isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="sheet-header">
                <EditableField fieldName="characterName" label="Nombre del Personaje" value={character.characterName} onUpdate={handleUpdate} />
                <EditableField fieldName="classAndLevel" label="Clase y Nivel" value={character.classAndLevel} onUpdate={handleUpdate} />
                <EditableField fieldName="background" label="Trasfondo" value={character.background} onUpdate={handleUpdate} />
                <EditableField fieldName="playerName" label="Nombre del Jugador" value={character.playerName} onUpdate={handleUpdate} />
                <EditableField fieldName="race" label="Raza" value={character.race} onUpdate={handleUpdate} />
                <EditableField fieldName="alignment" label="Alineamiento" value={character.alignment} onUpdate={handleUpdate} />
                <EditableField fieldName="experiencePoints" label="Puntos de Experiencia" type="number" value={character.experiencePoints} onUpdate={handleUpdate} />
            </div>

            <div className="tabs-nav">
                <button onClick={() => setActiveTab('main')} className={activeTab === 'main' ? 'active' : ''}>Principal</button>
                <button onClick={() => setActiveTab('backstory')} className={activeTab === 'backstory' ? 'active' : ''}>Apariencia e Historia</button>
                <button onClick={() => setActiveTab('spells')} className={activeTab === 'spells' ? 'active' : ''}>Conjuros</button>
            </div>

            <div className="tab-content">
                {activeTab === 'main' && (
                    <CharacterPageMain
                        character={character}
                        abilityModifiers={abilityModifiers}
                        onUpdate={handleUpdate}
                    />
                )}
                {activeTab === 'backstory' && (
                    <CharacterPageBackstory character={character} onUpdate={handleUpdate} />
                )}
                {activeTab === 'spells' && (
                    <CharacterPageSpells character={character} onUpdate={handleUpdate} />
                )}
            </div>
        </div>
    );
}