'use client';
import EditableField from './EditableField';

export default function CurrencyManager({ initialCurrency, onUpdate }) {
    return (
        <div className="sheet-box currency-box">
            <EditableField fieldName="currency.cp" label="CP" type="number" initialValue={initialCurrency.cp} onUpdate={onUpdate} />
            <EditableField fieldName="currency.sp" label="SP" type="number" initialValue={initialCurrency.sp} onUpdate={onUpdate} />
            <EditableField fieldName="currency.ep" label="EP" type="number" initialValue={initialCurrency.ep} onUpdate={onUpdate} />
            <EditableField fieldName="currency.gp" label="GP" type="number" initialValue={initialCurrency.gp} onUpdate={onUpdate} />
            <EditableField fieldName="currency.pp" label="PP" type="number" initialValue={initialCurrency.pp} onUpdate={onUpdate} />
        </div>
    );
}