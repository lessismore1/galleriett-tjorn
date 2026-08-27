import artist from './artist'
import artwork from './artwork'
import exhibition from './exhibition'
import galleryEvent from './galleryEvent'
import article from './article'
import location from './location'
import sponsor from './sponsor'
import video from './video'
import siteSettings from './siteSettings'
import seo from './objects/seo'
import pressQuote from './objects/pressQuote'
import externalCvEntry from './objects/externalCvEntry'
import installationView from './objects/installationView'
import sourceLink from './objects/sourceLink'

export const schemaTypes = [
  // documents
  artist,
  artwork,
  exhibition,
  galleryEvent,
  article,
  location,
  sponsor,
  video,
  siteSettings,
  // objects
  seo,
  pressQuote,
  externalCvEntry,
  installationView,
  sourceLink,
]
