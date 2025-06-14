import EditableField from './EditableField';

export default function CharacterPageSpells({ character, onFieldUpdate }) {
    return (
        <div>
            <h2>Spellcasting</h2>
            <div className="sheet-box" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <EditableField fieldName="spellcastingClass" label="Spellcasting Class" initialValue={character.spellcastingClass} onUpdate={onFieldUpdate} />
                <EditableField fieldName="spellcastingAbility" label="Spellcasting Ability" initialValue={character.spellcastingAbility} onUpdate={onFieldUpdate} />
                <EditableField fieldName="spellSaveDC" label="Spell Save DC" type="number" initialValue={character.spellSaveDC} onUpdate={onFieldUpdate} />
                <EditableField fieldName="spellAttackBonus" label="Spell Attack Bonus" type="number" initialValue={character.spellAttackBonus} onUpdate={onFieldUpdate} />
            </div>
            <p>La gestión detallada de la lista de hechizos estará disponible en una futura actualización.</p>
            {/* Aquí iría un gestor de hechizos más complejo, similar al de ataques */}
        </div>
    );
}