import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface AdBannerProps {
  title: string
  subtitle?: string
  buttonText: string
  buttonLink: string
  imageUrl: string
}

export default function AdBanner({ title, subtitle, buttonText, buttonLink, imageUrl }: AdBannerProps) {
  return (
    <section className="container-toy py-4">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={imageUrl}
          alt={title}
          className="h-64 w-full object-cover sm:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-center p-8 sm:p-12">
          <h2 className="max-w-md font-display text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          {subtitle && (
            <p className="mt-2 max-w-md text-sm text-gray-200 sm:text-base">{subtitle}</p>
          )}
          <Link
            to={buttonLink}
            className="btn-primary mt-5 w-fit"
          >
            {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
