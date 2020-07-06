<template>
  <v-navigation-drawer
    :value="isVisible"
    right
    absolute
    temporary
    @input="closeDrawer"
    width="50vw"
  >
    <v-tabs
      background-color="primary"
      dark
      v-model="tab"
    >
      <v-tab>Data</v-tab>
      <v-tab>Logs</v-tab>
    </v-tabs>

    <v-tabs-items
      v-model="tab"
    >
      <v-tab-item>
        <v-simple-table
          dense
          fixed-header
          height="calc(100vh - 48px)"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Key</th>
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>D2 Found</td>
                <td>{{ getD2Found ? 'Found' : 'Not Found' }}</td>
              </tr>
              <tr>
                <td>D2 Path</td>
                <td>{{ getD2Found ? getD2Path : 'Not Found' }}</td>
              </tr>
              <tr>
                <td>D2 Localization</td>
                <td>{{ getD2Found ? getLocalization : 'Not Yet' }}</td>
              </tr>
              <tr>
                <td>Units Editing</td>
                <td>{{ getSelected ? getSelected : 'Not Editing Yet' }}</td>
              </tr>
              <tr>
                <td>Current Editing Item</td>
                <td>{{ getSelected ? getCategories : 'Not Editing yet' }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
      <v-tab-item>
        <v-simple-table
          dense
          fixed-header
          height="calc(100vh - 48px)"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Log</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in getDebugLogs" 
                :key="index"
              >
                <td>{{item}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Debugger',
  computed: {
    ...mapGetters([
      'getD2Path',
      'getD2Found',
      'getLocalization',
      'getCategories',
      'getSelected',
      'getDebugLogs',
    ])
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    }
  },
  methods: {
    closeDrawer(value) {
      if (value === false) this.$emit('toggleDebugger')
    }
  },
  data: () => ({
    tab: null,
  })
}
</script>

<style lang="scss" scoped>
</style>