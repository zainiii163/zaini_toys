import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

export default function SEO({ title, description, keywords, image, url, type = 'website' }: SEOProps) {
  useEffect(() => {
    const siteName = 'Toy Shop Pakistan'
    const fullTitle = title ? `${title} | ${siteName}` : siteName

    document.title = fullTitle

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setProperty = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    if (description) setMeta('description', description)
    if (keywords) setMeta('keywords', keywords)

    setProperty('og:title', fullTitle)
    if (description) setProperty('og:description', description)
    setProperty('og:type', type)
    if (image) setProperty('og:image', image)
    if (url) setProperty('og:url', url)

    setMeta('twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('twitter:title', fullTitle)
    if (description) setMeta('twitter:description', description)
    if (image) setMeta('twitter:image', image)
  }, [title, description, keywords, image, url, type])

  return null
}
