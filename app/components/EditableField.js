'use client';

import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

export default function EditableField({ fieldName, initialValue, label, type = 'text', as = 'input', onUpdate }) {
  const [value, setValue] = useState(initialValue);

  const debouncedSave = useCallback(
    debounce(async (newValue) => {
      // RUTA CORREGIDA: Apuntamos a la URL correcta de la API
      const res = await fetch('/api/character/update-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: fieldName, value: newValue }),
      });
      if (res.ok && onUpdate) {
        const data = await res.json();
        // Pasamos el objeto de personaje completo para actualizar el estado principal
        onUpdate(data.character);
      }
    }, 1000),
    [fieldName, onUpdate]
  );

  const handleChange = (e) => {
    const newValue = type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value;
    setValue(newValue);
    debouncedSave(newValue);
  };

  const InputComponent = as;

  return (
    <div className="header-field">
      {label && <label htmlFor={fieldName}>{label}</label>}
      <InputComponent
        id={fieldName}
        name={fieldName}
        type={type}
        value={value || ''} // Aseguramos que el valor nunca sea null o undefined
        onChange={handleChange}
        className={as === 'textarea' ? 'sheet-textarea' : ''}
        placeholder={label}
      />
    </div>
  );
}
