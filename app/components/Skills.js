'use client';

const SKILL_LIST = [
  { name: 'Acrobacias', ability: 'dexterity' }, { name: 'Trato con Animales', ability: 'wisdom' },
  { name: 'Arcanos', ability: 'intelligence' }, { name: 'Atletismo', ability: 'strength' },
  { name: 'Engaño', ability: 'charisma' }, { name: 'Historia', ability: 'intelligence' },
  { name: 'Perspicacia', ability: 'wisdom' }, { name: 'Intimidación', ability: 'charisma' },
  { name: 'Investigación', ability: 'intelligence' }, { name: 'Medicina', ability: 'wisdom' },
  { name: 'Naturaleza', ability: 'intelligence' }, { name: 'Percepción', ability: 'wisdom' },
  { name: 'Interpretación', ability: 'charisma' }, { name: 'Persuasión', ability: 'charisma' },
  { name: 'Religión', ability: 'intelligence' }, { name: 'Juego de Manos', ability: 'dexterity' },
  { name: 'Sigilo', ability: 'dexterity' }, { name: 'Supervivencia', ability: 'wisdom' }
];
const SAVING_THROW_LIST = [
    { name: 'Fuerza', ability: 'strength' }, { name: 'Destreza', ability: 'dexterity' },
    { name: 'Constitución', ability: 'constitution' }, { name: 'Inteligencia', ability: 'intelligence' },
    { name: 'Sabiduría', ability: 'wisdom' }, { name: 'Carisma', ability: 'charisma' }
];

export default function Skills({ type, character, abilityModifiers, onUpdate }) {
    const isSavingThrow = type === 'savingThrow';
    const list = isSavingThrow ? SAVING_THROW_LIST : SKILL_LIST;
    const proficiencies = character[isSavingThrow ? 'savingThrowProficiencies' : 'skillProficiencies'] || [];
    const overrides = character[isSavingThrow ? 'savingThrowOverrides' : 'skillOverrides'] || {};
    const title = isSavingThrow ? 'Tiradas de Salvación' : 'Habilidades';
    
    const handleProficiencyToggle = (name) => {
        const newProficiencies = proficiencies.includes(name)
            ? proficiencies.filter(p => p !== name)
            : [...proficiencies, name];
        onUpdate({ [isSavingThrow ? 'savingThrowProficiencies' : 'skillProficiencies']: newProficiencies });
    };

    const handleOverrideChange = (name, value) => {
        const newOverrides = { ...overrides, [name]: value === '' ? undefined : Number(value) };
        // Limpia la clave si el valor está vacío para no guardar claves nulas
        if (value === '') delete newOverrides[name];
        onUpdate({ [isSavingThrow ? 'savingThrowOverrides' : 'skillOverrides']: newOverrides });
    };

    return (
        <div className="sheet-box">
            <h3>{title}</h3>
            <ul className="proficiencies-list">
                {list.map(item => {
                    const isProficient = proficiencies.includes(item.name);
                    const baseModifier = abilityModifiers[item.ability] || 0;
                    const proficiencyBonus = isProficient ? (character.proficiencyBonus || 2) : 0;
                    const calculatedValue = baseModifier + proficiencyBonus;
                    const finalValue = overrides[item.name] !== undefined ? overrides[item.name] : calculatedValue;

                    return (
                        <li key={item.name}>
                            <input type="checkbox" id={`prof-${type}-${item.name}`} checked={isProficient} onChange={() => handleProficiencyToggle(item.name)} />
                            <label htmlFor={`prof-${type}-${item.name}`} className="proficiency-label">
                                <span className="proficiency-value">{finalValue >= 0 ? `+${finalValue}` : finalValue}</span>
                                {item.name}
                                {!isSavingThrow && <span className="ability-short">({item.ability.slice(0, 3)})</span>}
                            </label>
                            <input
                                type="number"
                                className="proficiency-override"
                                value={overrides[item.name] || ''}
                                onChange={(e) => handleOverrideChange(item.name, e.target.value)}
                                placeholder={calculatedValue}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}