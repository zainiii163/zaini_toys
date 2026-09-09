import { api } from '../api'

export interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: { url: string; publicId: string }
  author: { _id: string; name: string; avatar?: string }
  category: string
  tags: string[]
  isPublished: boolean
  publishedAt: string
  viewCount: number
  createdAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: { page: number; pages: number; total: number; limit: number }
}

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PaginatedResponse<BlogPost>, Record<string, string>>({
      query: (params) => ({ url: '/blog', params }),
    }),
    getPostBySlug: builder.query<{ success: boolean; data: BlogPost }, string>({
      query: (slug) => `/blog/${slug}`,
    }),
    getBlogCategories: builder.query<{ success: boolean; data: string[] }, void>({
      query: () => '/blog/meta/categories',
    }),
  }),
})

export const { useGetPostsQuery, useGetPostBySlugQuery, useGetBlogCategoriesQuery } = blogApi
