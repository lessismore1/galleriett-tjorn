import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './deskStructure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '81lb9elz'
const dataset = process.env.SANITY_STUDIO_DATASET || 'development'

export default defineConfig({
  name: 'galleriett',
  title: 'GALLERIett',

  projectId,
  dataset,

  plugins: [structureTool({structure: deskStructure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
