'use client';
import EditableField from './EditableField';

export default function CurrencyManager({ currency, onUpdate }) {
    const handleCurrencyUpdate = (updatedCurrency) => {
        onUpdate({ currency: { ...currency, ...updatedCurrency } });
    };

    return (
        <div className="sheet-box currency-box">
            <h3>Monedas</h3>
            <EditableField fieldName="currency.cp" label="PC" type="number" value={currency.cp} onUpdate={handleCurrencyUpdate} />
            <EditableField fieldName="currency.sp" label="PP" type="number" value={currency.sp} onUpdate={handleCurrencyUpdate} />
            <EditableField fieldName="currency.ep" label="PE" type="number" value={currency.ep} onUpdate={handleCurrencyUpdate} />
            <EditableField fieldName="currency.gp" label="PO" type="number" value={currency.gp} onUpdate={handleCurrencyUpdate} />
            <EditableField fieldName="currency.pp" label="PPT" type="number" value={currency.pp} onUpdate={handleCurrencyUpdate} />
        </div>
    );
}