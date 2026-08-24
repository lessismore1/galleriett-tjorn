import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'url',
      title: 'Video-URL',
      type: 'url',
      description: 'YouTube, Vimeo, …',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Miniatyr',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'description', title: 'Beskrivning', type: 'text', rows: 3}),
    defineField({
      name: 'artists',
      title: 'Konstnärer',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
    }),
    defineField({
      name: 'exhibition',
      title: 'Utställning',
      type: 'reference',
      to: [{type: 'exhibition'}],
    }),
    defineField({name: 'publishedAt', title: 'Publicerad', type: 'date'}),
  ],
  preview: {
    select: {title: 'title', media: 'thumbnail'},
  },
})
