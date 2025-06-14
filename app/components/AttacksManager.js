'use client';
import { useState } from 'react';

export default function AttacksManager({ initialAttacks, characterStats, onUpdate }) {
    const [attacks, setAttacks] = useState(initialAttacks);

    const handleAddAttack = async () => {
        const res = await fetch('/api/character/attacks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'New Weapon', ability: 'Str', proficient: true, damageDie: '1d6', damageType: 'Bludgeoning' }),
        });
        if (res.ok) {
            const updatedAttacks = await res.json();
            setAttacks(updatedAttacks);
            onUpdate({ attacks: updatedAttacks });
        }
    };

    const handleRemoveAttack = async (attackId) => {
        const res = await fetch('/api/character/attacks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attackId }),
        });
        if (res.ok) {
            const updatedAttacks = await res.json();
            setAttacks(updatedAttacks);
            onUpdate({ attacks: updatedAttacks });
        }
    };

    const calculateBonus = (ability, proficient) => {
        const abilityMod = ability === 'Str' ? characterStats.strMod : characterStats.dexMod;
        const proficiencyBonus = proficient ? characterStats.proficiencyBonus : 0;
        return abilityMod + proficiencyBonus;
    };

    const getBonusString = (bonus) => (bonus >= 0 ? `+${bonus}` : bonus);

    return (
        <div className="sheet-box">
            <h3>Attacks & Spellcasting</h3>
            <div className="attacks-grid-header">
                <span>Name</span>
                <span>Atk Bonus</span>
                <span>Damage/Type</span>
            </div>
            {attacks.map((attack) => {
                const abilityMod = attack.ability === 'Str' ? characterStats.strMod : characterStats.dexMod;
                const atkBonus = calculateBonus(attack.ability, attack.proficient);
                const damageString = `${attack.damageDie} ${getBonusString(abilityMod)} ${attack.damageType}`;

                return (
                    <div key={attack._id} className="attack-row">
                        <input type="text" defaultValue={attack.name} className="attack-input" readOnly />
                        <input type="text" value={getBonusString(atkBonus)} className="attack-input-center" readOnly />
                        <input type="text" value={damageString} className="attack-input" readOnly />
                        <button onClick={() => handleRemoveAttack(attack._id)} className="remove-btn">X</button>
                    </div>
                );
            })}
            <button onClick={handleAddAttack} style={{ width: '100%', marginTop: '10px' }}>Add Attack</button>
            <p style={{fontSize: '0.8rem', textAlign: 'center', marginTop: '10px'}}>* Los detalles del ataque (nombre, dado, etc.) se editan en el panel de admin por ahora.</p>
        </div>
    );
}