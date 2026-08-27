import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Webbplats',
  type: 'document',
  // Singleton — enforced via Studio structure (one document)
  fields: [
    defineField({name: 'siteName', title: 'Sajtnamn', type: 'string', initialValue: 'GALLERIett'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'email', title: 'E-post', type: 'string'}),
    defineField({name: 'phone', title: 'Telefon', type: 'string'}),
    defineField({name: 'address', title: 'Adress', type: 'text', rows: 3}),
    defineField({name: 'openingHours', title: 'Öppettider', type: 'text', rows: 2}),
    defineField({name: 'about', title: 'Om-text', type: 'text', rows: 8}),
    defineField({
      name: 'aboutImage',
      title: 'Om-bild',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'instagramUrl', title: 'Instagram', type: 'url'}),
    defineField({name: 'facebookUrl', title: 'Facebook', type: 'url'}),
    defineField({
      name: 'showSponsors',
      title: 'Visa sponsorer på sajten',
      type: 'boolean',
      description:
        'När av: sponsor-sektion på startsidan och /sponsorer döljs. Kod och Studio-innehåll sparas — slå på när sponsorpaket är klart.',
      initialValue: false,
    }),
    defineField({
      name: 'location',
      title: 'Primär plats',
      type: 'reference',
      to: [{type: 'location'}],
    }),
    defineField({name: 'seo', title: 'SEO (default)', type: 'seo'}),
  ],
  preview: {
    prepare() {
      return {title: 'Webbplatsinställningar'}
    },
  },
})
