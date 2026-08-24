import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '81lb9elz'
const dataset = process.env.SANITY_STUDIO_DATASET || 'development'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    autoUpdates: true,
  },
})
