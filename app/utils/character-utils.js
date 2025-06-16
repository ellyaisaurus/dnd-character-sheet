// app/utils/character-utils.js
// --- ARCHIVO NUEVO ---

export function calculateAbilityModifiers(character) {
    if (!character) return {};
    const modifiers = {};
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    abilities.forEach(ability => {
        const stat = character[ability];
        if (!stat) {
            modifiers[ability] = -5; // Un valor por defecto si el stat no existe
            return;
        };
        const total = (stat.base || 0) + (stat.modifications?.reduce((acc, mod) => acc + mod.value, 0) || 0);
        modifiers[ability] = Math.floor((total - 10) / 2);
    });
    return modifiers;
}