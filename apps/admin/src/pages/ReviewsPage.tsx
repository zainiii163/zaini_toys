import { useState } from 'react'
import { Star, Check, X, MessageSquare } from 'lucide-react'
import { useGetReviewsQuery, useApproveReviewMutation, useRejectReviewMutation, useFeatureReviewMutation, useReplyToReviewMutation } from '../app/services/review'
import { formatDate } from '../lib/utils'

export default function ReviewsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const params: Record<string, string> = { page: String(page), limit: '10' }
  if (statusFilter) params.status = statusFilter

  const { data, isLoading } = useGetReviewsQuery(params)
  const [approveReview] = useApproveReviewMutation()
  const [rejectReview] = useRejectReviewMutation()
  const [featureReview] = useFeatureReviewMutation()
  const [replyToReview] = useReplyToReviewMutation()

  const reviews = data?.data || []
  const pagination = data?.pagination

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return
    await replyToReview({ id, reply: replyText })
    setReplyTo(null)
    setReplyText('')
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Reviews</h1>

      <div className="mb-4 flex gap-2">
        {[
          { value: '', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'featured', label: 'Featured' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => { setStatusFilter(f.value); setPage(1) }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${statusFilter === f.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="stat-card animate-pulse"><div className="h-24 bg-gray-200 rounded" /></div>)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="stat-card text-center py-12 text-gray-500">No reviews found</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="stat-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="font-medium">{review.user?.name}</span>
                    {review.isVerifiedPurchase && <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">Verified</span>}
                    {review.isFeatured && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700">Featured</span>}
                    <span className={`rounded px-1.5 py-0.5 text-xs ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold">{review.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    Product: {review.product?.name} | {formatDate(review.createdAt)}
                  </p>
                  {review.adminReply && (
                    <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm">
                      <p className="font-medium text-blue-700">Admin Reply:</p>
                      <p className="text-blue-600">{review.adminReply}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  {!review.isApproved && (
                    <button onClick={() => approveReview(review._id)} className="rounded p-1.5 text-green-600 hover:bg-green-50" title="Approve">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {review.isApproved && (
                    <button onClick={() => rejectReview(review._id)} className="rounded p-1.5 text-red-600 hover:bg-red-50" title="Reject">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => featureReview({ id: review._id, isFeatured: !review.isFeatured })}
                    className={`rounded p-1.5 ${review.isFeatured ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={review.isFeatured ? 'Unfeature' : 'Feature'}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { setReplyTo(replyTo === review._id ? null : review._id); setReplyText(review.adminReply || '') }}
                    className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                    title="Reply"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {replyTo === review._id && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="input-toy flex-1"
                  />
                  <button onClick={() => handleReply(review._id)} className="btn-primary !py-1.5 text-sm">Send</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
