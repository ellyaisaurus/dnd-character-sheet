// app/admin/players/[id]/view/page.js
// --- ARCHIVO NUEVO ---

import { notFound } from 'next/navigation';
import dbConnect from '../../../lib/mongodb';
import Character from '../../../models/Character';
import { calculateAbilityModifiers } from '../../../utils/character-utils'; // Crearemos este helper

// Componentes reutilizados de la hoja de personaje
import CharacterPageMain from '../../../components/CharacterPageMain';
import CharacterPageBackstory from '../../../components/CharacterPageBackstory';
import CharacterPageSpells from '../../../components/CharacterPageSpells';
import EditableField from '../../../components/EditableField';

// Función para obtener los datos del personaje. Es un Server Component.
async function getCharacterForAdmin(userId) {
    await dbConnect();
    const character = await Character.findOne({ userId: userId }).lean();
    if (!character) {
        notFound();
    }
    return JSON.parse(JSON.stringify(character));
}

// Helper para evitar errores en componentes que esperan una función
const noOp = () => {};

export default async function AdminViewPlayerSheet({ params }) {
    const character = await getCharacterForAdmin(params.id);
    const abilityModifiers = calculateAbilityModifiers(character);

    return (
        <div>
            <h2 style={{ borderBottom: 'none', marginBottom: '20px' }}>
                Viendo la hoja de: {character.characterName} (Jugador: {character.playerName})
            </h2>

            {/* Reutilizamos la estructura de la hoja del jugador en modo "solo lectura" */}
            <div className="sheet-header">
                <EditableField fieldName="characterName" label="Nombre del Personaje" value={character.characterName} onUpdate={noOp} />
                <EditableField fieldName="classAndLevel" label="Clase y Nivel" value={character.classAndLevel} onUpdate={noOp} />
                <EditableField fieldName="background" label="Trasfondo" value={character.background} onUpdate={noOp} />
                <EditableField fieldName="playerName" label="Nombre del Jugador" value={character.playerName} onUpdate={noOp} />
                <EditableField fieldName="race" label="Raza" value={character.race} onUpdate={noOp} />
                <EditableField fieldName="alignment" label="Alineamiento" value={character.alignment} onUpdate={noOp} />
                <EditableField fieldName="experiencePoints" label="Puntos de Experiencia" type="number" value={character.experiencePoints} onUpdate={noOp} />
            </div>

            <div className="tabs-nav">
                <button className="active">Principal</button>
                <button>Apariencia e Historia</button>
                <button>Conjuros</button>
            </div>

            <div className="tab-content">
                <CharacterPageMain
                    character={character}
                    abilityModifiers={abilityModifiers}
                    onUpdate={noOp} // Pasamos una función vacía
                />
                <hr style={{margin: '40px 0'}} />
                 <CharacterPageBackstory character={character} onUpdate={noOp} />
                 <hr style={{margin: '40px 0'}} />
                 <CharacterPageSpells character={character} onUpdate={noOp} />
            </div>
        </div>
    );
}