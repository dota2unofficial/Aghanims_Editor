import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'getCurrentAvatar',
        ]),
        getUnitAvatar() {
            return this.getCurrentAvatar
        }
    },
}