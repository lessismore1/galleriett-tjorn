import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '811b9elz',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
})
