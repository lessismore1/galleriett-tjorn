import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'externalCvEntry',
  title: 'CV-post (utanför G1)',
  type: 'object',
  fields: [
    defineField({name: 'year', title: 'År', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'place', title: 'Plats / institution', type: 'string'}),
    defineField({name: 'note', title: 'Notering', type: 'string'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'year'},
  },
})
