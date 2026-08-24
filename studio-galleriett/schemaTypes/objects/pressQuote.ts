import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'pressQuote',
  title: 'Presscitat',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Citat',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({name: 'source', title: 'Källa', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'url', title: 'URL', type: 'url'}),
  ],
  preview: {
    select: {title: 'source', subtitle: 'quote'},
  },
})
