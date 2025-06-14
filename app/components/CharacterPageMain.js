import StatEditor from './StatEditor';
import EditableField from './EditableField';
import AttacksManager from './AttacksManager';
import EquipmentManager from './EquipmentManager';
import CurrencyManager from './CurrencyManager';

const SKILLS = [
  { name: 'Acrobatics', ability: 'Dex' }, { name: 'Animal Handling', ability: 'Wis' },
  { name: 'Arcana', ability: 'Int' }, { name: 'Athletics', ability: 'Str' },
  { name: 'Deception', ability: 'Cha' }, { name: 'History', ability: 'Int' },
  { name: 'Insight', ability: 'Wis' }, { name: 'Intimidation', ability: 'Cha' },
  { name: 'Investigation', ability: 'Int' }, { name: 'Medicine', ability: 'Wis' },
  { name: 'Nature', ability: 'Int' }, { name: 'Perception', ability: 'Wis' },
  { name: 'Performance', ability: 'Cha' }, { name: 'Persuasion', ability: 'Cha' },
  { name: 'Religion', ability: 'Int' }, { name: 'Sleight of Hand', ability: 'Dex' },
  { name: 'Stealth', ability: 'Dex' }, { name: 'Survival', ability: 'Wis' }
];
const SAVING_THROWS = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

export default function CharacterPageMain({ character, abilityModifiers, onStatUpdate, onFieldUpdate, onProficiencyToggle }) {
    // Comprobación de seguridad: si character no está cargado, no renderizar nada.
    if (!character) {
        return null;
    }

    const characterStats = {
        strMod: abilityModifiers.Strength || 0,
        dexMod: abilityModifiers.Dexterity || 0,
        proficiencyBonus: character.proficiencyBonus || 2
    };

    // Aseguramos que los arrays de proficiencias existan antes de usarlos.
    const savingThrowProficiencies = character.savingThrowProficiencies || [];
    const skillProficiencies = character.skillProficiencies || [];

    return (
        <div className="character-sheet-grid">
            {/* --- COLUMNA IZQUIERDA --- */}
            <div className="grid-col">
                <div className="sheet-box">
                    {SAVING_THROWS.map(ability => (
                        <StatEditor key={ability} label={ability} statName={ability.toLowerCase()} initialStat={character[ability.toLowerCase()]} onUpdate={onStatUpdate} />
                    ))}
                </div>
                <div className="sheet-box">
                    <h3>Saving Throws</h3>
                    <ul className="proficiencies-list">
                        {SAVING_THROWS.map(st => {
                            // LÍNEA CORREGIDA: Usamos la variable segura 'savingThrowProficiencies'
                            const isProficient = savingThrowProficiencies.includes(st);
                            const modifier = (abilityModifiers[st] || 0) + (isProficient ? character.proficiencyBonus : 0);
                            return (
                                <li key={st}>
                                    <input type="checkbox" id={`prof-st-${st}`} checked={isProficient} onChange={() => onProficiencyToggle('savingThrowProficiencies', st)} />
                                    <span>{modifier >= 0 ? `+${modifier}` : modifier}</span>
                                    <label htmlFor={`prof-st-${st}`}>{st}</label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="sheet-box">
                    <h3>Skills</h3>
                    <ul className="proficiencies-list">
                        {SKILLS.map(skill => {
                            const abilityShort = skill.ability;
                            const abilityFullName = SAVING_THROWS.find(st => st.startsWith(abilityShort));
                            // LÍNEA CORREGIDA: Usamos la variable segura 'skillProficiencies'
                            const isProficient = skillProficiencies.includes(skill.name);
                            const modifier = (abilityModifiers[abilityFullName] || 0) + (isProficient ? character.proficiencyBonus : 0);
                            return (
                                <li key={skill.name}>
                                    <input type="checkbox" id={`prof-skill-${skill.name}`} checked={isProficient} onChange={() => onProficiencyToggle('skillProficiencies', skill.name)} />
                                    <span>{modifier >= 0 ? `+${modifier}` : modifier}</span>
                                    <label htmlFor={`prof-skill-${skill.name}`}>{skill.name}</label>
                                    <span className="ability-short">({abilityShort})</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* --- COLUMNA CENTRAL --- */}
            <div className="grid-col">
                <div className="combat-stats-grid">
                    <div className="combat-stat"><label>Armor Class</label><span className="value">{character.armorClass?.base || 10}</span></div>
                    <div className="combat-stat"><label>Initiative</label><span className="value">{(abilityModifiers.Dexterity || 0) >= 0 ? `+${abilityModifiers.Dexterity || 0}` : (abilityModifiers.Dexterity || 0)}</span></div>
                    <div className="combat-stat"><label>Speed</label><span className="value">{character.speed?.base || 30}ft.</span></div>
                </div>
                <div className="sheet-box">
                    <h3>Hit Points</h3>
                    <StatEditor label="Hit Point Maximum" statName="hitPointMaximum" initialStat={character.hitPointMaximum} onUpdate={onStatUpdate} />
                    <EditableField fieldName="currentHitPoints" label="Current Hit Points" type="number" initialValue={character.currentHitPoints} onUpdate={onFieldUpdate} />
                    <EditableField fieldName="temporaryHitPoints" label="Temporary Hit Points" type="number" initialValue={character.temporaryHitPoints} onUpdate={onFieldUpdate} />
                </div>
                <AttacksManager initialAttacks={character.attacks || []} characterStats={characterStats} onUpdate={onFieldUpdate} />
                <div style={{display: 'flex', gap: '15px'}}>
                    <CurrencyManager initialCurrency={character.currency || {}} onUpdate={onFieldUpdate} />
                    <EquipmentManager initialEquipment={character.equipment || []} onUpdate={onFieldUpdate} />
                </div>
            </div>

            {/* --- COLUMNA DERECHA --- */}
            <div className="grid-col">
                <div className="sheet-box">
                    <h3>Personality Traits</h3>
                    <EditableField as="textarea" fieldName="personalityTraits" initialValue={character.personalityTraits} onUpdate={onFieldUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Ideals</h3>
                    <EditableField as="textarea" fieldName="ideals" initialValue={character.ideals} onUpdate={onFieldUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Bonds</h3>
                    <EditableField as="textarea" fieldName="bonds" initialValue={character.bonds} onUpdate={onFieldUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Flaws</h3>
                    <EditableField as="textarea" fieldName="flaws" initialValue={character.flaws} onUpdate={onFieldUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Features & Traits</h3>
                    <EditableField as="textarea" fieldName="featuresAndTraits" initialValue={character.featuresAndTraits} onUpdate={onFieldUpdate} />
                </div>
            </div>
        </div>
    );
}