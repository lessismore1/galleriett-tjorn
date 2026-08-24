import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'artwork',
  title: 'Konstverk',
  type: 'document',
  fields: [
    defineField({
      name: 'idNumber',
      title: 'Verk-ID',
      type: 'number',
      description: 'Löpnummer från 1001 (galleriets verkserie)',
      validation: (r) => r.required().min(1001),
    }),
    defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) =>
          [doc.idNumber, doc.title, doc.year].filter(Boolean).join('-'),
        maxLength: 120,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Konstnär',
      type: 'reference',
      to: [{type: 'artist'}],
      validation: (r) => r.required(),
    }),
    defineField({name: 'year', title: 'År', type: 'number', validation: (r) => r.required()}),
    defineField({name: 'medium', title: 'Teknik', type: 'string'}),
    defineField({name: 'dimensions', title: 'Mått', type: 'string'}),
    defineField({
      name: 'availability',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Tillgänglig', value: 'available'},
          {title: 'Pris vid förfrågan', value: 'inquiry'},
          {title: 'Såld', value: 'sold'},
          {title: 'Ej till salu', value: 'not_for_sale'},
        ],
        layout: 'radio',
      },
      initialValue: 'inquiry',
    }),
    defineField({name: 'story', title: 'Berättelse', type: 'text', rows: 5}),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {
      title: 'title',
      idNumber: 'idNumber',
      artistName: 'artist.name',
      media: 'image',
    },
    prepare({title, idNumber, artistName, media}) {
      return {
        title: idNumber ? `${idNumber} · ${title}` : title,
        subtitle: artistName,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Verk-ID',
      name: 'idAsc',
      by: [{field: 'idNumber', direction: 'asc'}],
    },
  ],
})
