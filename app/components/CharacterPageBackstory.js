import EditableField from './EditableField';

export default function CharacterPageBackstory({ character, onFieldUpdate }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="grid-col">
                <div className="sheet-box">
                    <h3>Appearance</h3>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <EditableField fieldName="age" label="Age" initialValue={character.age} onUpdate={onFieldUpdate} />
                        <EditableField fieldName="height" label="Height" initialValue={character.height} onUpdate={onFieldUpdate} />
                        <EditableField fieldName="weight" label="Weight" initialValue={character.weight} onUpdate={onFieldUpdate} />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <EditableField fieldName="eyes" label="Eyes" initialValue={character.eyes} onUpdate={onFieldUpdate} />
                        <EditableField fieldName="skin" label="Skin" initialValue={character.skin} onUpdate={onFieldUpdate} />
                        <EditableField fieldName="hair" label="Hair" initialValue={character.hair} onUpdate={onFieldUpdate} />
                    </div>
                </div>
                <div className="sheet-box">
                    <h3>Character Appearance</h3>
                    <EditableField as="textarea" fieldName="characterAppearance" initialValue={character.characterAppearance} onUpdate={onFieldUpdate} />
                </div>
                <div className="sheet-box">
                    <h3>Allies & Organizations</h3>
                    <EditableField as="textarea" fieldName="alliesAndOrganizations" initialValue={character.alliesAndOrganizations} onUpdate={onFieldUpdate} />
                </div>
            </div>
            <div className="grid-col">
                <div className="sheet-box" style={{height: '100%'}}>
                    <h3>Character Backstory</h3>
                    <EditableField as="textarea" fieldName="characterBackstory" initialValue={character.characterBackstory} onUpdate={onFieldUpdate} />
                </div>
            </div>
        </div>
    );
}