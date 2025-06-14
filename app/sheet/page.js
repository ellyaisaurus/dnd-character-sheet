'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CharacterPageMain from '../components/CharacterPageMain';
import CharacterPageBackstory from '../components/CharacterPageBackstory';
import CharacterPageSpells from '../components/CharacterPageSpells';
import EditableField from '../components/EditableField'; // <-- ¡AQUÍ ESTÁ LA LÍNEA QUE FALTABA!
import isEqual from 'lodash/isEqual';

export default function SheetPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [originalCharacter, setOriginalCharacter] = useState(null);
    const [character, setCharacter] = useState(null); // Este es el estado que se edita
    
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('main');

    const isDirty = useMemo(() => {
        if (!originalCharacter || !character) return false;
        return !isEqual(originalCharacter, character);
    }, [originalCharacter, character]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (status === 'authenticated' && !originalCharacter) {
            setLoading(true);
            fetch('/api/character')
                .then(res => {
                    if (!res.ok) throw new Error('No se encontró la hoja de personaje. ¿Has creado una?');
                    return res.json();
                })
                .then(data => {
                    setOriginalCharacter(data);
                    setCharacter(data); // Inicializa ambos estados
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [status, router, originalCharacter]);

    const handleUpdate = (updatedFields) => {
        setCharacter(prev => ({ ...prev, ...updatedFields }));
    };

    const handleSave = async () => {
        if (!isDirty) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/character/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(character),
            });
            if (!res.ok) throw new Error('Error al guardar los cambios.');
            const savedCharacter = await res.json();
            setOriginalCharacter(savedCharacter); // Sincroniza el estado original
            setCharacter(savedCharacter); // Y el estado de edición
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const abilityModifiers = useMemo(() => {
        if (!character) return {};
        const modifiers = {};
        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        abilities.forEach(ability => {
            const stat = character[ability];
            if (!stat) return;
            const total = (stat.base || 0) + (stat.modifications?.reduce((acc, mod) => acc + mod.value, 0) || 0);
            modifiers[ability] = Math.floor((total - 10) / 2);
        });
        return modifiers;
    }, [character]);

    if (loading || status === 'loading') return <p>Cargando tu leyenda...</p>;
    if (error) return <p style={{ color: 'var(--color-failure-red)' }}>Error: {error}</p>;
    if (!character) return <p>No se pudo cargar la hoja de personaje.</p>;

    return (
        <div>
            <div className="save-bar">
                <span>{isDirty ? 'Tienes cambios sin guardar.' : 'Todos los cambios guardados.'}</span>
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