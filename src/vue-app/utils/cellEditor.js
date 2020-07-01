import enums from '../assets/enums'

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
        default:
            break
    }
    return options.members ? options.members.map(item => item.name) : []
}