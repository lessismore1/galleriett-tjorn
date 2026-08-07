import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'exhibition',
  title: 'Utställning',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({
      name: 'artist',
      title: 'Konstnär',
      type: 'reference',
      to: [{type: 'artist'}],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pågående', value: 'ongoing'},
          {title: 'Kommande', value: 'upcoming'},
          {title: 'Arkiv', value: 'past'},
        ],
      },
    }),
    defineField({name: 'start', title: 'Startdatum', type: 'date'}),
    defineField({name: 'end', title: 'Slutdatum', type: 'date'}),
    defineField({name: 'intro', title: 'Intro', type: 'text'}),
    defineField({name: 'image', title: 'Bild', type: 'image', options: {hotspot: true}}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'status', media: 'image'},
  },
})
