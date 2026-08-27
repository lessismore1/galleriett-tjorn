import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'sourceLink',
  title: 'Källa',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Etikett',
      type: 'string',
      description: 't.ex. Instagram, Affisch, Press',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (r) => r.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'url'},
  },
})
