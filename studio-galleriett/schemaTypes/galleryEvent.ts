import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'galleryEvent',
  title: 'Evenemang',
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
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Vernissage', value: 'vernissage'},
          {title: 'Pub', value: 'pub'},
          {title: 'Zipp & Paint', value: 'sip-paint'},
          {title: 'Samtal', value: 'samtal'},
          {title: 'Övrigt', value: 'other'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'date', title: 'Datum', type: 'datetime', validation: (r) => r.required()}),
    defineField({
      name: 'datesLabel',
      title: 'Datumetikett',
      type: 'string',
      description: 'Valfri visningstext',
    }),
    defineField({name: 'price', title: 'Pris', type: 'string'}),
    defineField({name: 'capacity', title: 'Antal platser', type: 'number'}),
    defineField({name: 'bookingUrl', title: 'Bokningslänk', type: 'url'}),
    defineField({
      name: 'bookingMailto',
      title: 'Boka via e-post',
      type: 'string',
      description: 't.ex. info@galleriett-tjorn.se',
    }),
    defineField({
      name: 'exhibition',
      title: 'Kopplad utställning',
      type: 'reference',
      to: [{type: 'exhibition'}],
    }),
    defineField({
      name: 'artists',
      title: 'Medverkande konstnärer',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
    }),
    defineField({
      name: 'location',
      title: 'Plats',
      type: 'reference',
      to: [{type: 'location'}],
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'body', title: 'Beskrivning', type: 'text', rows: 8}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', kind: 'kind', date: 'date', media: 'image'},
    prepare({title, kind, date, media}) {
      const when = date ? new Date(date).toLocaleDateString('sv-SE') : ''
      return {
        title,
        subtitle: [kind, when].filter(Boolean).join(' · '),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Datum (kommande först)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
})
