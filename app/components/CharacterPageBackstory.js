import EditableField from './EditableField';

export default function CharacterPageBackstory({ character, onUpdate }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="grid-col">
                <div className="sheet-box">
                    <h3>Apariencia</h3>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <EditableField fieldName="age" label="Edad" value={character.age} onUpdate={onUpdate} />
                        <EditableField fieldName="height" label="Altura" value={character.height} onUpdate={onUpdate} />
                        <EditableField fieldName="weight" label="Peso" value={character.weight} onUpdate={onUpdate} />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <EditableField fieldName="eyes" label="Ojos" value={character.eyes} onUpdate={onUpdate} />
                        <EditableField fieldName="skin" label="Piel" value={character.skin} onUpdate={onUpdate} />
                        <EditableField fieldName="hair" label="Pelo" value={character.hair} onUpdate={onUpdate} />
                    </div>
                </div>
                <div className="sheet-box">
                    <h3>Apariencia del Personaje</h3>
                    <EditableField as="textarea" fieldName="characterAppearance" value={character.characterAppearance} onUpdate={onUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Aliados y Organizaciones</h3>
                    <EditableField as="textarea" fieldName="alliesAndOrganizations" value={character.alliesAndOrganizations} onUpdate={onUpdate} />
                </div>
            </div>
            <div className="grid-col">
                <div className="sheet-box" style={{height: '100%'}}>
                    <h3>Historia del Personaje</h3>
                    <EditableField as="textarea" fieldName="characterBackstory" value={character.characterBackstory} onUpdate={onUpdate} />
                </div>
            </div>
        </div>
    );
}