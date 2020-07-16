import enums from '../assets/enums'
import descriptions from '../assets/description'

export const getConstData = (key) => {
    let options = [];
    const arrayEnums = Object.keys(enums).map(key => enums[key])
    switch (key) {
        case 'AttackCapabilities':
            options = arrayEnums.find(item => item.name === "UnitAttackCapability")
            break
        case 'BoundsHullName':
            options = arrayEnums.find(item => item.name === "HullSize")
            break
        case 'MovementCapabilities':
            options = arrayEnums.find(item => item.name === "UnitMoveCapability")
            break
        case 'TeamName':
            options = arrayEnums.find(item => item.name === "Team")
            break
        case 'CombatClassAttack':
            options = arrayEnums.find(item => item.name === "CombatClassAttack")
            break
        case 'CombatClassDefend':
            options = arrayEnums.find(item => item.name === "CombatClassDefend")
            break
        case 'UnitRelationshipClass':
            options = arrayEnums.find(item => item.name === "NpcUnitRelationshipType")
            break
        case 'AbilityType':
            options = arrayEnums.find(item => item.name === "AbilityType")
            break
        case 'AbilityUnitDamageType':
            options = arrayEnums.find(item => item.name === "DamageType")
            break
        case 'AbilityCastAnimation':
            options = arrayEnums.find(item => item.name === "Activity")
            break
        default:
            options = arrayEnums.find(item => item.name === key) ? arrayEnums.find(item => item.name === key) : {}
            break
    }
    return options.members ? options.members.map(item => item.name) : []
}

export const getDescription = (key) => {
    return descriptions[key]
}