'use client';
import { FaTrash } from 'react-icons/fa';

export default function AttacksManager({ attacks, abilityModifiers, proficiencyBonus, onUpdate }) {
    
    const handleUpdateAttack = (index, field, value) => {
        const newAttacks = [...attacks];
        newAttacks[index] = { ...newAttacks[index], [field]: value };
        onUpdate({ attacks: newAttacks });
    };

    const handleAddAttack = () => {
        const newAttack = { name: 'Nueva Arma', ability: 'strength', proficient: true, damageDie: '1d6', damageType: 'Contundente' };
        onUpdate({ attacks: [...attacks, newAttack] });
    };

    const handleRemoveAttack = (index) => {
        const newAttacks = attacks.filter((_, i) => i !== index);
        onUpdate({ attacks: newAttacks });
    };

    return (
        <div className="sheet-box">
            <h3>Ataques y Conjuros</h3>
            <div className="attacks-grid-header">
                <span>Nombre</span>
                <span>Bono</span>
                <span>Daño/Tipo</span>
                <span></span>
            </div>
            {attacks.map((attack, index) => {
                const abilityMod = abilityModifiers[attack.ability] || 0;
                const atkBonus = abilityMod + (attack.proficient ? proficiencyBonus : 0);
                const damageBonus = abilityMod;

                return (
                    <div key={index} className="attack-row">
                        <input type="text" value={attack.name} onChange={(e) => handleUpdateAttack(index, 'name', e.target.value)} className="attack-input" />
                        <input type="text" value={atkBonus >= 0 ? `+${atkBonus}` : atkBonus} className="attack-input-center" readOnly />
                        <input type="text" value={`${attack.damageDie} ${damageBonus >= 0 ? `+${damageBonus}` : damageBonus} ${attack.damageType}`} className="attack-input" readOnly />
                        <button onClick={() => handleRemoveAttack(index)} className="remove-btn"><FaTrash /></button>
                    </div>
                );
            })}
            <button onClick={handleAddAttack} style={{ width: '100%', marginTop: '10px' }}>Añadir Ataque</button>
        </div>
    );
}