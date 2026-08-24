import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Namn', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
    }),
    defineField({
      name: 'logo',
      title: 'Logotyp',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'url', title: 'Länk', type: 'url'}),
    defineField({name: 'order', title: 'Sortering', type: 'number'}),
  ],
  preview: {
    select: {title: 'name', media: 'logo'},
  },
  orderings: [
    {
      title: 'Sortering',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
