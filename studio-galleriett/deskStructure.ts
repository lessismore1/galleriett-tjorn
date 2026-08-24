import type {StructureResolver} from 'sanity/structure'

const SITE_SETTINGS_ID = 'siteSettings'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Innehåll')
    .items([
      S.listItem()
        .title('Webbplats')
        .id(SITE_SETTINGS_ID)
        .child(S.document().schemaType('siteSettings').documentId(SITE_SETTINGS_ID)),
      S.divider(),
      S.documentTypeListItem('artist').title('Konstnärer'),
      S.documentTypeListItem('artwork').title('Verk'),
      S.documentTypeListItem('exhibition').title('Utställningar'),
      S.documentTypeListItem('galleryEvent').title('Evenemang'),
      S.documentTypeListItem('article').title('Nyheter'),
      S.divider(),
      S.documentTypeListItem('location').title('Platser'),
      S.documentTypeListItem('sponsor').title('Sponsorer'),
      S.documentTypeListItem('video').title('Video'),
    ])
