import mongoose from 'mongoose';

const StatModificationSchema = new mongoose.Schema({
    value: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const StatSchema = new mongoose.Schema({
    base: { type: Number, default: 10 },
    modifications: [StatModificationSchema]
});

const AttackSchema = new mongoose.Schema({
    name: { type: String, default: 'New Attack' },
    ability: { type: String, enum: ['Str', 'Dex'], default: 'Str' },
    proficient: { type: Boolean, default: true },
    damageDie: { type: String, default: '1d6' },
    damageType: { type: String, default: 'Bludgeoning' }
});

const EquipmentItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 }
});

const SpellLevelSchema = new mongoose.Schema({
    slotsTotal: { type: Number, default: 0 },
    slotsExpended: { type: Number, default: 0 },
    spells: [{
        name: { type: String, default: '' },
        prepared: { type: Boolean, default: false }
    }]
});

const CharacterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    characterName: { type: String, default: 'Nameless Hero' },
    classAndLevel: { type: String, default: 'Commoner 1' },
    background: { type: String, default: 'Unknown' },
    playerName: { type: String, default: '' },
    race: { type: String, default: 'Human' },
    alignment: { type: String, default: 'True Neutral' },
    experiencePoints: { type: Number, default: 0 },

    strength: { type: StatSchema, default: () => ({ base: 10 }) },
    dexterity: { type: StatSchema, default: () => ({ base: 10 }) },
    constitution: { type: StatSchema, default: () => ({ base: 10 }) },
    intelligence: { type: StatSchema, default: () => ({ base: 10 }) },
    wisdom: { type: StatSchema, default: () => ({ base: 10 }) },
    charisma: { type: StatSchema, default: () => ({ base: 10 }) },

    inspiration: { type: Number, default: 0 },
    proficiencyBonus: { type: Number, default: 2 },
    
    savingThrowProficiencies: { type: [String], default: [] },
    skillProficiencies: { type: [String], default: [] },

    passiveWisdom: { type: Number, default: 10 },

    armorClass: { type: StatSchema, default: () => ({ base: 10 }) },
    initiative: { type: StatSchema, default: () => ({ base: 0 }) },
    speed: { type: StatSchema, default: () => ({ base: 30 }) },

    hitPointMaximum: { type: StatSchema, default: () => ({ base: 10 }) },
    currentHitPoints: { type: Number, default: 10 },
    temporaryHitPoints: { type: Number, default: 0 },

    hitDiceTotal: { type: Number, default: 1 },
    hitDiceType: { type: String, default: 'd8' },

    deathSaves: {
        successes: { type: Number, default: 0, max: 3 },
        failures: { type: Number, default: 0, max: 3 }
    },

    attacks: [AttackSchema],
    equipment: [EquipmentItemSchema],
    
    currency: {
        cp: { type: Number, default: 0 },
        sp: { type: Number, default: 0 },
        ep: { type: Number, default: 0 },
        gp: { type: Number, default: 0 },
        pp: { type: Number, default: 0 },
    },

    personalityTraits: { type: String, default: '' },
    ideals: { type: String, default: '' },
    bonds: { type: String, default: '' },
    flaws: { type: String, default: '' },

    otherProficienciesAndLanguages: { type: String, default: '' },
    featuresAndTraits: { type: String, default: '' },

    age: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    eyes: { type: String, default: '' },
    skin: { type: String, default: '' },
    hair: { type: String, default: '' },

    characterAppearance: { type: String, default: '' },
    characterBackstory: { type: String, default: '' },
    alliesAndOrganizations: { type: String, default: '' },
    allySymbolUrl: { type: String, default: '' },
    additionalFeaturesAndTraits: { type: String, default: '' },
    treasure: { type: String, default: '' },

    spellcastingClass: { type: String, default: '' },
    spellcastingAbility: { type: String, enum: ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma', ''], default: '' },
    spellSaveDC: { type: Number, default: 8 },
    spellAttackBonus: { type: Number, default: 0 },
    
    spells: {
        cantrips: [{ name: String, prepared: { type: Boolean, default: true } }],
        level1: { type: SpellLevelSchema, default: () => ({}) },
        level2: { type: SpellLevelSchema, default: () => ({}) },
        level3: { type: SpellLevelSchema, default: () => ({}) },
        level4: { type: SpellLevelSchema, default: () => ({}) },
        level5: { type: SpellLevelSchema, default: () => ({}) },
        level6: { type: SpellLevelSchema, default: () => ({}) },
        level7: { type: SpellLevelSchema, default: () => ({}) },
        level8: { type: SpellLevelSchema, default: () => ({}) },
        level9: { type: SpellLevelSchema, default: () => ({}) },
    }

}, { timestamps: true, minimize: false });

// LÍNEA CORREGIDA: Aseguramos que siempre se exporte un modelo válido.
const Character = mongoose.models.Character || mongoose.model('Character', CharacterSchema);
export default Character;