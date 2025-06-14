'use client';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

export default function EquipmentManager({ equipment, onUpdate }) {
    const [newItemName, setNewItemName] = useState('');

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        const newItem = { name: newItemName, quantity: 1 };
        onUpdate({ equipment: [...equipment, newItem] });
        setNewItemName('');
    };

    const handleRemoveItem = (index) => {
        const newEquipment = equipment.filter((_, i) => i !== index);
        onUpdate({ equipment: newEquipment });
    };

    const handleUpdateItem = (index, field, value) => {
        const newEquipment = [...equipment];
        newEquipment[index] = { ...newEquipment[index], [field]: value };
        onUpdate({ equipment: newEquipment });
    };

    return (
        <div className="sheet-box">
            <h3>Equipo</h3>
            <ul className="equipment-list">
                {equipment.map((item, index) => (
                    <li key={index}>
                        <input type="number" value={item.quantity} onChange={(e) => handleUpdateItem(index, 'quantity', Number(e.target.value))} className="equipment-quantity" />
                        <input type="text" value={item.name} onChange={(e) => handleUpdateItem(index, 'name', e.target.value)} className="equipment-name" />
                        <button onClick={() => handleRemoveItem(index)} className="remove-btn"><FaTrash /></button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Nombre del nuevo objeto"
                />
                <button type="submit" style={{ width: 'auto' }}>Añadir</button>
            </form>
        </div>
    );
}