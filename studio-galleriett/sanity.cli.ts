import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'REPLACE_ME',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
})
