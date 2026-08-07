import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Konstnär',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Namn', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'specialty', title: 'Inriktning', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text'}),
    defineField({name: 'bio', title: 'Biografi', type: 'text'}),
    defineField({name: 'image', title: 'Bild', type: 'image', options: {hotspot: true}}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'specialty', media: 'image'},
  },
})
