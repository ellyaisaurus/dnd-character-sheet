'use client';

export default function EditableField({
    fieldName,
    value,
    label,
    type = 'text',
    as = 'input',
    onUpdate,
    containerClass = 'header-field',
    inputClass = ''
}) {
    const handleChange = (e) => {
        const rawValue = e.target.value;
        let finalValue = rawValue;

        if (type === 'number') {
            finalValue = rawValue === '' ? 0 : Number(rawValue);
        }
        
        // Para campos anidados como 'currency.cp'
        if (fieldName.includes('.')) {
            const keys = fieldName.split('.');
            const updatedNestedField = { [keys[1]]: finalValue };
            onUpdate({ [keys[0]]: updatedNestedField });
        } else {
            onUpdate({ [fieldName]: finalValue });
        }
    };

    const InputComponent = as;

    return (
        <div className={containerClass}>
            {label && <label htmlFor={fieldName}>{label}</label>}
            <InputComponent
                id={fieldName}
                name={fieldName}
                type={type}
                value={value || ''}
                onChange={handleChange}
                className={`${as === 'textarea' ? 'sheet-textarea' : ''} ${inputClass}`}
                placeholder={label}
            />
        </div>
    );
}