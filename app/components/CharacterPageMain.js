import StatBlock from './StatBlock';
import EditableField from './EditableField';
import AttacksManager from './AttacksManager';
import EquipmentManager from './EquipmentManager';
import CurrencyManager from './CurrencyManager';
import Skills from './Skills'; // Nuevo componente

const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const ABILITY_NAMES_ES = {
    strength: 'Fuerza', dexterity: 'Destreza', constitution: 'Constitución',
    intelligence: 'Inteligencia', wisdom: 'Sabiduría', charisma: 'Carisma'
};

export default function CharacterPageMain({ character, abilityModifiers, onUpdate }) {
    if (!character) return null;

    return (
        <div className="character-sheet-grid">
            {/* --- COLUMNA IZQUIERDA --- */}
            <div className="grid-col">
                {ABILITIES.map(ability => (
                    <StatBlock
                        key={ability}
                        label={ABILITY_NAMES_ES[ability]}
                        statName={ability}
                        stat={character[ability]}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>

            {/* --- COLUMNA CENTRAL --- */}
            <div className="grid-col">
                <div className="combat-stats-grid">
                    <EditableField containerClass="combat-stat" fieldName="armorClass.base" label="Clase de Armadura" type="number" value={character.armorClass?.base || 10} onUpdate={onUpdate} inputClass="value" />
                    <div className="combat-stat"><label>Iniciativa</label><span className="value">{abilityModifiers.dexterity >= 0 ? `+${abilityModifiers.dexterity}` : abilityModifiers.dexterity}</span></div>
                    <EditableField containerClass="combat-stat" fieldName="speed.base" label="Velocidad" type="text" value={character.speed?.base ? `${character.speed.base}ft.` : '30ft.'} onUpdate={onUpdate} inputClass="value" />
                </div>
                <div className="sheet-box">
                    <h3>Puntos de Golpe</h3>
                    <StatBlock label="Puntos de Golpe Máximos" statName="hitPointMaximum" stat={character.hitPointMaximum} onUpdate={onUpdate} />
                    <EditableField fieldName="currentHitPoints" label="Puntos de Golpe Actuales" type="number" value={character.currentHitPoints} onUpdate={onUpdate} />
                    <EditableField fieldName="temporaryHitPoints" label="Puntos de Golpe Temporales" type="number" value={character.temporaryHitPoints} onUpdate={onUpdate} />
                </div>
                <Skills
                    type="savingThrow"
                    character={character}
                    abilityModifiers={abilityModifiers}
                    onUpdate={onUpdate}
                />
                <Skills
                    type="skill"
                    character={character}
                    abilityModifiers={abilityModifiers}
                    onUpdate={onUpdate}
                />
            </div>

            {/* --- COLUMNA DERECHA --- */}
            <div className="grid-col">
                <AttacksManager attacks={character.attacks || []} abilityModifiers={abilityModifiers} proficiencyBonus={character.proficiencyBonus} onUpdate={onUpdate} />
                <EquipmentManager equipment={character.equipment || []} onUpdate={onUpdate} />
                <CurrencyManager currency={character.currency || {}} onUpdate={onUpdate} />
                <div className="sheet-box">
                    <h3>Rasgos de Personalidad</h3>
                    <EditableField as="textarea" fieldName="personalityTraits" value={character.personalityTraits} onUpdate={onUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Ideales</h3>
                    <EditableField as="textarea" fieldName="ideals" value={character.ideals} onUpdate={onUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Vínculos</h3>
                    <EditableField as="textarea" fieldName="bonds" value={character.bonds} onUpdate={onUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Defectos</h3>
                    <EditableField as="textarea" fieldName="flaws" value={character.flaws} onUpdate={onUpdate} />
                </div>
            </div>
        </div>
    );
}