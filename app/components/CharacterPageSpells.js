import EditableField from './EditableField';

export default function CharacterPageSpells({ character, onUpdate }) {
    return (
        <div>
            <h2>Lanzamiento de Conjuros</h2>
            <div className="sheet-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <EditableField fieldName="spellcastingClass" label="Clase Lanzadora de Conjuros" value={character.spellcastingClass} onUpdate={onUpdate} />
                <EditableField fieldName="spellcastingAbility" label="Aptitud Mágica" value={character.spellcastingAbility} onUpdate={onUpdate} />
                <EditableField fieldName="spellSaveDC" label="CD de Salvación de Conjuros" type="number" value={character.spellSaveDC} onUpdate={onUpdate} />
                <EditableField fieldName="spellAttackBonus" label="Bono de Ataque de Conjuros" type="number" value={character.spellAttackBonus} onUpdate={onUpdate} />
            </div>
            <p>La gestión detallada de la lista de hechizos estará disponible en una futura actualización.</p>
        </div>
    );
}