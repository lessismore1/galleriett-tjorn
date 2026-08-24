import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'description', title: 'Beskrivning', type: 'text', rows: 3}),
    defineField({
      name: 'image',
      title: 'Delningsbild',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})
