export default {
    methods: {
        getUnitAvatar(key, path) {
            if (!key) return null
            const name = key.replace('npc_dota_', '')
            return `file:///${path}Round_${name[0].toUpperCase()}${name.slice(1)}.png`
        }
    }
}