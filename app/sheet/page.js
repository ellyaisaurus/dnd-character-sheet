'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EditableField from '../components/EditableField';
import CharacterPageMain from '../components/CharacterPageMain';
import CharacterPageBackstory from '../components/CharacterPageBackstory';
import CharacterPageSpells from '../components/CharacterPageSpells';

const SAVING_THROWS = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

export default function SheetPage() {
    const { status } = useSession();
    const router = useRouter();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // Estado para manejar errores
    const [activeTab, setActiveTab] = useState('main');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        
        if (status === 'authenticated' && !character) {
            fetch('/api/character') // La URL es correcta
                .then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.message || `Error ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    setCharacter(data);
                })
                .catch(err => {
                    console.error("Failed to fetch character sheet:", err);
                    setError(err.message); // Guardamos el mensaje de error
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [status, router, character]);

    const handleStatUpdate = (statName, updatedStat) => {
        setCharacter(prev => ({ ...prev, [statName]: updatedStat }));
    };

    const handleFieldUpdate = (updatedCharacterData) => {
        setCharacter(prev => ({ ...prev, ...updatedCharacterData }));
    };

    const handleProficiencyToggle = async (type, name) => {
        if (!character) return;
        const currentProficiencies = character[type] || [];
        const newProficiencies = currentProficiencies.includes(name)
            ? currentProficiencies.filter(p => p !== name)
            : [...currentProficiencies, name];

        const res = await fetch('/api/character/update-field', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: type, value: newProficiencies }),
        });

        if (res.ok) {
            const data = await res.json();
            setCharacter(data.character);
        }
    };

    const abilityModifiers = useMemo(() => {
        if (!character) return {};
        const modifiers = {};
        SAVING_THROWS.forEach(ability => {
            const stat = character[ability.toLowerCase()];
            if (!stat) return;
            const total = stat.base + (stat.modifications?.reduce((acc, mod) => acc + mod.value, 0) || 0);
            modifiers[ability] = Math.floor((total - 10) / 2);
        });
        return modifiers;
    }, [character]);

    if (loading || status === 'loading') {
        return <p>Cargando tu leyenda...</p>;
    }

    // Si hubo un error al cargar, lo mostramos
    if (error) {
        return <p style={{ color: 'var(--color-failure-red)' }}>Error al cargar la hoja: {error}</p>;
    }
    
    // Si no hay personaje después de cargar, mostramos un mensaje útil
    if (!character) {
        return <p>No se pudo cargar la hoja de personaje. Es posible que no se haya creado una para tu cuenta.</p>;
    }

    return (
        <div>
            <div className="sheet-header">
                <EditableField fieldName="characterName" label="Character Name" initialValue={character.characterName} onUpdate={handleFieldUpdate} />
                <EditableField fieldName="classAndLevel" label="Class & Level" initialValue={character.classAndLevel} onUpdate={handleFieldUpdate} />
                <EditableField fieldName="background" label="Background" initialValue={character.background} onUpdate={handleFieldUpdate} />
                <EditableField fieldName="playerName" label="Player Name" initialValue={character.playerName} onUpdate={handleFieldUpdate} />
                <EditableField fieldName="race" label="Race" initialValue={character.race} onUpdate={handleFieldUpdate} />
                <EditableField fieldName="alignment" label="Alignment" initialValue={character.alignment} onUpdate={handleFieldUpdate} />
                <EditableField fieldName="experiencePoints" label="Experience Points" type="number" initialValue={character.experiencePoints} onUpdate={handleFieldUpdate} />
            </div>

            <div className="tabs-nav">
                <button onClick={() => setActiveTab('main')} className={activeTab === 'main' ? 'active' : ''}>Main Stats</button>
                <button onClick={() => setActiveTab('backstory')} className={activeTab === 'backstory' ? 'active' : ''}>Appearance & Backstory</button>
                <button onClick={() => setActiveTab('spells')} className={activeTab === 'spells' ? 'active' : ''}>Spellcasting</button>
            </div>

            <div className="tab-content">
                {activeTab === 'main' && (
                    <CharacterPageMain
                        character={character}
                        abilityModifiers={abilityModifiers}
                        onStatUpdate={handleStatUpdate}
                        onFieldUpdate={handleFieldUpdate}
                        onProficiencyToggle={handleProficiencyToggle}
                    />
                )}
                {activeTab === 'backstory' && (
                    <CharacterPageBackstory character={character} onUpdate={handleFieldUpdate} />
                )}
                {activeTab === 'spells' && (
                    <CharacterPageSpells character={character} onUpdate={handleFieldUpdate} />
                )}
            </div>
        </div>
    );
}
