import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'location',
  title: 'Plats',
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
    defineField({
      name: 'kind',
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Galleri', value: 'gallery'},
          {title: 'Publik lokal', value: 'publicVenue'},
          {title: 'Ateljé', value: 'artistStudio'},
        ],
      },
      initialValue: 'gallery',
    }),
    defineField({
      name: 'hostedByArtist',
      title: 'Ateljé-ägare',
      type: 'reference',
      to: [{type: 'artist'}],
      hidden: ({parent}) => parent?.kind !== 'artistStudio',
    }),
    defineField({name: 'address', title: 'Adress', type: 'text', rows: 2}),
    defineField({name: 'openingHours', title: 'Öppettider', type: 'text', rows: 2}),
    defineField({name: 'transport', title: 'Hitta hit', type: 'text', rows: 3}),
    defineField({name: 'googleMapsUrl', title: 'Google Maps', type: 'url'}),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'description', title: 'Beskrivning', type: 'text', rows: 4}),
    defineField({name: 'email', title: 'E-post', type: 'string'}),
    defineField({name: 'phone', title: 'Telefon', type: 'string'}),
    defineField({name: 'website', title: 'Webbplats', type: 'url'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'kind', media: 'image'},
  },
})
