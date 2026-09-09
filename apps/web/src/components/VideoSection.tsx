import { Play, Eye } from 'lucide-react'

const videos = [
  {
    title: 'LEGO City Fire Station Build',
    duration: '12:34',
    views: '24.5K',
    thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=340&fit=crop',
  },
  {
    title: 'Hot Wheels Mega Track Review',
    duration: '8:21',
    views: '18.2K',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=340&fit=crop',
  },
  {
    title: 'Top 10 Educational Toys 2026',
    duration: '15:07',
    views: '31.8K',
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=340&fit=crop',
  },
  {
    title: 'Nerf Blaster Unboxing & Demo',
    duration: '10:45',
    views: '15.9K',
    thumbnail: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=340&fit=crop',
  },
]

export default function VideoSection() {
  return (
    <section className="container-toy py-12">
      <h2 className="mb-8 font-display text-2xl font-semibold">Toy Videos</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((video) => (
          <div key={video.title} className="card-toy group overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                {video.duration}
              </span>
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 text-sm font-medium">{video.title}</h3>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <Eye className="h-3 w-3" />
                {video.views} views
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
