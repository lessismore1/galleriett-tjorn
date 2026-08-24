import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Konstnär',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Namn', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({name: 'specialty', title: 'Inriktning', type: 'string'}),
    defineField({name: 'born', title: 'Född', type: 'string', description: 't.ex. 1983, Göteborg, Sverige'}),
    defineField({
      name: 'education',
      title: 'Utbildning',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
    defineField({name: 'bio', title: 'Biografi', type: 'text', rows: 8}),
    defineField({
      name: 'image',
      title: 'Porträtt',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero-bild',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'pressQuotes',
      title: 'Presscitat',
      type: 'array',
      of: [{type: 'pressQuote'}],
    }),
    defineField({
      name: 'externalCv',
      title: 'CV utanför GALLERIett',
      type: 'array',
      of: [{type: 'externalCvEntry'}],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'specialty', media: 'image'},
  },
  orderings: [
    {
      title: 'Namn A–Ö',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
