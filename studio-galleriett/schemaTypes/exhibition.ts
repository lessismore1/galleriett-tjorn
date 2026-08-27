import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'exhibition',
  title: 'Utställning',
  type: 'document',
  fields: [
    defineField({
      name: 'idNumber',
      title: 'Utställnings-ID',
      type: 'number',
      description: 't.ex. 104',
      validation: (r) => r.required().min(1),
    }),
    defineField({name: 'title', title: 'Titel', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => [doc.idNumber, doc.title].filter(Boolean).join('-'),
        maxLength: 120,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'artists',
      title: 'Konstnärer',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'artistLabel',
      title: 'Konstnärsrubrik',
      type: 'string',
      description: 'Visningsnamn i hero, t.ex. “Kattis Palmnäs & Robert Oldergaarden”',
    }),
    defineField({name: 'start', title: 'Startdatum', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'end', title: 'Slutdatum', type: 'date', validation: (r) => r.required()}),
    defineField({
      name: 'datesLabel',
      title: 'Datumetikett',
      type: 'string',
      description: 'Valfri visningstext, t.ex. “1–9 AUG 2026”',
    }),
    defineField({
      name: 'status',
      title: 'Status (manuell override)',
      type: 'string',
      description: 'Lämna tom — status beräknas från start/end i webben. Override endast vid behov.',
      options: {
        list: [
          {title: 'Pågående', value: 'ongoing'},
          {title: 'Kommande', value: 'upcoming'},
          {title: 'Tidigare', value: 'past'},
        ],
      },
    }),
    defineField({name: 'intro', title: 'Intro / pitch', type: 'text', rows: 4}),
    defineField({name: 'pressRelease', title: 'Pressmeddelande', type: 'text', rows: 12}),
    defineField({
      name: 'image',
      title: 'Affisch / hero',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'cardImage',
      title: 'Kortbild',
      type: 'image',
      options: {hotspot: true},
      description: 'Valfri — annars används affisch',
    }),
    defineField({
      name: 'works',
      title: 'Verk (hängning)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'artwork'}]}],
    }),
    defineField({
      name: 'installationViews',
      title: 'Installationsbilder',
      type: 'array',
      of: [{type: 'installationView'}],
    }),
    defineField({
      name: 'location',
      title: 'Plats',
      type: 'reference',
      to: [{type: 'location'}],
    }),
    defineField({
      name: 'facebookEventUrl',
      title: 'Facebook-event',
      type: 'url',
      description:
        'Endast riktiga Facebook-event (RSVP). Visas som “Kommer”-CTA bara för kommande/pågående. Instagram och andra källor → fältet Källor.',
    }),
    defineField({
      name: 'sources',
      title: 'Källor',
      type: 'array',
      description: 'Instagram-inlägg, affischer, artiklar m.m. — dokumentation, inte RSVP.',
      of: [{type: 'sourceLink'}],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {
      title: 'title',
      idNumber: 'idNumber',
      artistLabel: 'artistLabel',
      start: 'start',
      media: 'image',
    },
    prepare({title, idNumber, artistLabel, start, media}) {
      return {
        title: idNumber ? `${idNumber} · ${title}` : title,
        subtitle: [artistLabel, start].filter(Boolean).join(' · '),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Utställnings-ID',
      name: 'idNumberAsc',
      by: [{field: 'idNumber', direction: 'asc'}],
    },
    {
      title: 'Startdatum (nyast)',
      name: 'startDesc',
      by: [{field: 'start', direction: 'desc'}],
    },
  ],
})
