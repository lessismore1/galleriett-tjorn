import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Konstnär',
  type: 'document',
  fields: [
    defineField({
      name: 'idNumber',
      title: 'Konstnärs-ID',
      type: 'number',
      description: 't.ex. 11',
      validation: (r) => r.required().min(1),
    }),
    defineField({name: 'name', title: 'Namn', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => [doc.idNumber, doc.name].filter(Boolean).join('-'),
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'profileKind',
      title: 'Profildjup',
      type: 'string',
      description:
        'Styr listor och badges. stub = tunn post (ofta dold på /konstnarer). kmh = länka till KmH. historical = avlidna / historiska konstnärer (badge: Historisk).',
      options: {
        list: [
          {title: 'Full (G1-profil)', value: 'full'},
          {title: 'Stub (tunn)', value: 'stub'},
          {title: 'KmH (länk till Konst med Horisont)', value: 'kmh'},
          {title: 'Historisk (avliden)', value: 'historical'},
        ],
        layout: 'radio',
      },
      initialValue: 'stub',
    }),
    defineField({name: 'specialty', title: 'Inriktning', type: 'string'}),
    defineField({
      name: 'deceased',
      title: 'Avliden / historisk person',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'presentedBy',
      title: 'Verk visas via',
      type: 'string',
      description: 't.ex. Niklas Gadd (släkt/bo) när konstnären själv inte ställer ut.',
      hidden: ({document}) => !document?.deceased && document?.profileKind !== 'historical',
    }),
    defineField({
      name: 'kmhSlug',
      title: 'KmH-slug',
      type: 'string',
      description: 'Slug på konstmedhorisont.se — används för extern länk.',
      hidden: ({document}) => document?.profileKind !== 'kmh' && !document?.kmhSlug,
    }),
    defineField({
      name: 'born',
      title: 'Född',
      type: 'string',
      description: 't.ex. 20 oktober 1910, Hunnebostrand — bara födelse, inte död.',
    }),
    defineField({
      name: 'died',
      title: 'Död',
      type: 'string',
      description: 't.ex. 8 februari 2016 — lämna tomt för levande. Kryssa även Avliden.',
      hidden: ({document}) => !document?.deceased && document?.profileKind !== 'historical' && !document?.died,
    }),
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
    select: {
      title: 'name',
      specialty: 'specialty',
      kind: 'profileKind',
      idNumber: 'idNumber',
      media: 'image',
    },
    prepare({title, specialty, kind, idNumber, media}) {
      const id = idNumber != null ? `${String(idNumber).padStart(2, '0')} · ` : ''
      const kindLabel = kind && kind !== 'full' ? ` · ${kind}` : ''
      return {
        title: `${id}${title || 'Namnlös'}`,
        subtitle: `${specialty || '—'}${kindLabel}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Konstnärs-ID',
      name: 'idNumberAsc',
      by: [{field: 'idNumber', direction: 'asc'}],
    },
    {
      title: 'Namn A–Ö',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
