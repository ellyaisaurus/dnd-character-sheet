// app/admin/players/[id]/view/page.js
// --- CÓDIGO CORREGIDO ---

import { notFound } from 'next/navigation';
// --- RUTAS DE IMPORTACIÓN CORREGIDAS ---
import dbConnect from '@/app/lib/mongodb';
import Character from '@/app/models/Character';
import { calculateAbilityModifiers } from '@/app/utils/character-utils';
import CharacterPageMain from '@/app/components/CharacterPageMain';
import CharacterPageBackstory from '@/app/components/CharacterPageBackstory';
import CharacterPageSpells from '@/app/components/CharacterPageSpells';
import EditableField from '@/app/components/EditableField';
// --- FIN DE CORRECCIÓN DE RUTAS ---


async function getCharacterForAdmin(userId) {
    await dbConnect();
    const character = await Character.findOne({ userId: userId }).lean();
    if (!character) {
        notFound();
    }
    return JSON.parse(JSON.stringify(character));
}

const noOp = () => {};

export default async function AdminViewPlayerSheet({ params }) {
    const character = await getCharacterForAdmin(params.id);
    const abilityModifiers = calculateAbilityModifiers(character);

    return (
        <div>
            <h2 style={{ borderBottom: 'none', marginBottom: '20px' }}>
                Viendo la hoja de: {character.characterName} (Jugador: {character.playerName})
            </h2>

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
                    onUpdate={noOp}
                />
                <hr style={{margin: '40px 0'}} />
                 <CharacterPageBackstory character={character} onUpdate={noOp} />
                 <hr style={{margin: '40px 0'}} />
                 <CharacterPageSpells character={character} onUpdate={noOp} />
            </div>
        </div>
    );
}