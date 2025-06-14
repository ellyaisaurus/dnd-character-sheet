'use client';
import { useState } from 'react';

export default function EquipmentManager({ initialEquipment, onUpdate }) {
    const [equipment, setEquipment] = useState(initialEquipment);
    const [newItemName, setNewItemName] = useState('');

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        const res = await fetch('/api/character/equipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newItemName, quantity: 1 }),
        });
        if (res.ok) {
            const updatedEquipment = await res.json();
            setEquipment(updatedEquipment);
            onUpdate({ equipment: updatedEquipment });
            setNewItemName('');
        }
    };

    const handleRemoveItem = async (itemId) => {
        const res = await fetch('/api/character/equipment', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId }),
        });
        if (res.ok) {
            const updatedEquipment = await res.json();
            setEquipment(updatedEquipment);
            onUpdate({ equipment: updatedEquipment });
        }
    };

    return (
        <div className="sheet-box">
            <h3>Equipment</h3>
            <ul className="equipment-list">
                {equipment.map(item => (
                    <li key={item._id}>
                        <span>{item.name} (x{item.quantity})</span>
                        <button onClick={() => handleRemoveItem(item._id)} className="remove-btn">X</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="New item name"
                />
                <button type="submit" style={{ width: 'auto' }}>Add</button>
            </form>
        </div>
    );
}