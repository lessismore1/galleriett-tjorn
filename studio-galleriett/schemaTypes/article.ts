import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Artikel',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Från GALLERIett', value: 'gallery'},
          {title: 'I pressen', value: 'press'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'publishedAt', title: 'Publicerad', type: 'date', validation: (r) => r.required()}),
    defineField({
      name: 'dateLabel',
      title: 'Datumetikett',
      type: 'string',
      description: 'Valfri visningstext, t.ex. “28 juli 2026”',
    }),
    defineField({name: 'excerpt', title: 'Ingress', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Brödtext', type: 'text', rows: 12}),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'thumb',
      title: 'Tumme',
      type: 'image',
      options: {hotspot: true},
      description: 'Valfri — för listor (NewsListItem)',
    }),
    defineField({
      name: 'source',
      title: 'Extern källa (I pressen)',
      type: 'object',
      hidden: ({parent}) => parent?.kind !== 'press',
      fields: [
        defineField({name: 'name', title: 'Källnamn', type: 'string'}),
        defineField({name: 'url', title: 'URL', type: 'url'}),
      ],
    }),
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
    defineField({
      name: 'clickable',
      title: 'Har intern artikelsida',
      type: 'boolean',
      initialValue: true,
      description: 'Av för press som bara länkar externt',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', kind: 'kind', date: 'publishedAt', media: 'image'},
    prepare({title, kind, date, media}) {
      const label = kind === 'press' ? 'I pressen' : 'Från GALLERIett'
      return {
        title,
        subtitle: [label, date].filter(Boolean).join(' · '),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Publicerad (nyast)',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
