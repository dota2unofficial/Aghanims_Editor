import { getLocalization } from 'dota-data/lib/localization'

export default {
    methods: {
        async getLocalization(key) {
            try {
                const localization = await getLocalization('english', {cache: {path: './localization', preferCached: true}})
                return localization
            } catch (err) {
                throw err
            }
        },
    }
}