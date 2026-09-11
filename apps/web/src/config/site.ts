export const SITE_NAME = 'Toy Shop'
export const SITE_TAGLINE = "Pakistan's #1 Toy Store"

export interface Announcement {
  text: string
  link: string
}

export const ANNOUNCEMENTS: Announcement[] = [
  { text: '🎉 Check Newly Arrived Squishy Toys — Shop Now', link: '/shop?newArrival=true' },
  { text: '🃏 UNO Flash Cards & Family Games — Visit Now', link: '/shop?search=uno' },
  { text: '🚚 Free Shipping on Orders Over Rs. 3,000', link: '/shop' },
]

export interface TrustItem {
  text: string
  emoji: string
  link: string
}

export const TRUST_ITEMS: TrustItem[] = [
  { text: 'Loved by Parents', emoji: '❤️', link: '/about' },
  { text: 'Your Purchase Protection', emoji: '🛡️', link: '/faq' },
  { text: 'Delivery Tracker', emoji: '🚚', link: '/account/orders' },
  { text: "Let's Connect", emoji: '💬', link: '/contact' },
]

export interface AgeGroup {
  label: string
  emoji: string
  ageMin: number
  ageMax: number
  tile: string
}

export const AGE_GROUPS: AgeGroup[] = [
  { label: '0–12 Months', emoji: '👶', ageMin: 0, ageMax: 1, tile: 'bg-pink-50 text-pink-600' },
  { label: '1–3 Years', emoji: '🧒', ageMin: 1, ageMax: 3, tile: 'bg-purple-50 text-purple-600' },
  { label: '3–6 Years', emoji: '🎨', ageMin: 3, ageMax: 6, tile: 'bg-blue-50 text-blue-600' },
  { label: '6–9 Years', emoji: '🚀', ageMin: 6, ageMax: 9, tile: 'bg-teal-50 text-teal-600' },
  { label: '9–12 Years', emoji: '⭐', ageMin: 9, ageMax: 12, tile: 'bg-amber-50 text-amber-600' },
  { label: '12+ Years', emoji: '🎮', ageMin: 12, ageMax: 99, tile: 'bg-red-50 text-red-600' },
]

export interface BudgetRange {
  label: string
  emoji: string
  max: number
}

export const BUDGET_RANGES: BudgetRange[] = [
  { label: 'Under Rs. 499', emoji: '😊', max: 499 },
  { label: 'Under Rs. 999', emoji: '🎈', max: 999 },
  { label: 'Under Rs. 1,999', emoji: '🎁', max: 1999 },
  { label: 'Under Rs. 4,999', emoji: '🚀', max: 4999 },
]

export interface LittleOne {
  label: string
  emoji: string
  gender?: 'male' | 'female'
  ageMin?: number
  ageMax?: number
  tile: string
}

export const LITTLE_ONES: LittleOne[] = [
  { label: 'Babies', emoji: '👶', ageMin: 0, ageMax: 2, tile: 'from-pink-100 to-orange-50' },
  { label: 'Boys', emoji: '🧢', gender: 'male', tile: 'from-sky-100 to-teal-100' },
  { label: 'Girls', emoji: '👧', gender: 'female', tile: 'from-fuchsia-100 to-pink-100' },
]

export type SocialIcon = 'facebook' | 'instagram' | 'tiktok' | 'youtube'

export interface Social {
  label: string
  href: string
  icon: SocialIcon
}

export const SOCIALS: Social[] = [
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
]

export const PAYMENT_METHODS = ['JazzCash', 'EasyPaisa', 'Visa', 'Mastercard', 'DIB']

export const COURIERS = ['TCS', 'Leopards', 'PostEx', 'Trax', 'DEX']

export const STORE_HELP = {
  phone: '0300-1234567',
  phoneHref: 'tel:+923001234567',
  whatsapp: '0300-1234567',
  whatsappHref: 'https://wa.me/923001234567',
  email: 'support@toyshop.pk',
  emailHref: 'mailto:support@toyshop.pk',
  address: 'Karachi, Pakistan',
  hours: 'Mon–Sat · 9 AM – 9 PM',
}

export const SEO_TEXT = {
  title: 'Buy Toys For Kids & Baby Toys Online In Pakistan',
  paragraphs: [
    'Welcome to Toy Shop — Pakistan’s #1 online toy store. From educational toys and STEM kits to ride-ons, dolls, puzzles, and remote-control cars, we stock thousands of authentic, safe, and age-appropriate toys for babies, boys, and girls of every age.',
    'Shop by age, budget, or category with prices to fit every pocket — from fun toys under Rs. 499 to premium gift sets. Every order is delivered across Pakistan with Cash on Delivery, easy 7-day returns, and 100% authentic products guaranteed.',
  ],
}

export const FOOTER_LINKS = {
  shop: [
    { label: 'All Toys', to: '/shop' },
    { label: 'New Arrivals', to: '/shop?newArrival=true' },
    { label: 'Best Sellers', to: '/shop?bestSeller=true' },
    { label: 'Deals & Offers', to: '/shop?onSale=true' },
    { label: 'Gift Finder', to: '/gift-finder' },
  ],
  company: [
    { label: 'Loved by Parents', to: '/about' },
    { label: 'Your Purchase Protection', to: '/faq' },
    { label: 'Delivery Tracker', to: '/account/orders' },
    { label: "Let's Connect", to: '/contact' },
    { label: 'Blog', to: '/blog' },
  ],
  help: [
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Returns & Exchanges', to: '/account' },
    { label: 'Whole-sale Enquiries', to: '/wholesale' },
    { label: 'Support / Tickets', to: '/support' },
  ],
}