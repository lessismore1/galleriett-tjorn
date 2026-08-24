import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'installationView',
  title: 'Installationsbild',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({name: 'caption', title: 'Bildtext', type: 'string'}),
    defineField({name: 'alt', title: 'Alt-text', type: 'string'}),
  ],
  preview: {
    select: {title: 'caption', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Installationsbild', media}
    },
  },
})
