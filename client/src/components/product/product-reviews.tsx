import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, User, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarContent, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
  className?: string;
}

interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  images?: string[];
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export default function ProductReviews({ productId, className }: ProductReviewsProps) {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    userName: '',
    userEmail: ''
  });

  // Fetch reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['/api/products', productId, 'reviews'],
  });

  // Calculate review statistics
  const reviewStats: ReviewStats = {
    averageRating: reviews.length > 0 
      ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length 
      : 0,
    totalReviews: reviews.length,
    ratingDistribution: reviews.reduce((dist: { [key: number]: number }, review: Review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1;
      return dist;
    }, {})
  };

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: (reviewData: any) => apiRequest('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ ...reviewData, productId })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId, 'reviews'] });
      setShowReviewForm(false);
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        userName: '',
        userEmail: ''
      });
    }
  });

  // Mark review as helpful mutation
  const helpfulMutation = useMutation({
    mutationFn: (reviewId: string) => apiRequest(`/api/reviews/${reviewId}/helpful`, {
      method: 'POST'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId, 'reviews'] });
    }
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.title && newReview.comment && newReview.userName) {
      addReviewMutation.mutate(newReview);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300 dark:text-gray-600'
            )}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className={cn("dark:bg-gray-800 dark:border-gray-600", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("dark:bg-gray-800 dark:border-gray-600", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="dark:text-white">{t('reviews')}</CardTitle>
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('addReview')}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Review Stats */}
        {reviews.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold dark:text-white">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div className="mb-2">{renderStars(reviewStats.averageRating, 'lg')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {reviewStats.totalReviews} {t('reviews')}
              </div>
            </div>

            <div className="col-span-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviewStats.ratingDistribution[rating] || 0;
                const percentage = reviewStats.totalReviews > 0 
                  ? (count / reviewStats.totalReviews) * 100 
                  : 0;

                return (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-8 dark:text-gray-300">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Review Form */}
        {showReviewForm && (
          <Card className="border-primary/20 dark:bg-gray-700/50 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">{t('writeReview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      {t('name')}
                    </label>
                    <Input
                      value={newReview.userName}
                      onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                      required
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      {t('email')} ({t('optional')})
                    </label>
                    <Input
                      type="email"
                      value={newReview.userEmail}
                      onChange={(e) => setNewReview(prev => ({ ...prev, userEmail: e.target.value }))}
                      className="dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    {t('rating')}
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      >
                        <Star
                          className={cn(
                            "h-6 w-6 transition-colors",
                            star <= newReview.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 hover:text-yellow-400 dark:text-gray-600'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    {t('reviewTitle')}
                  </label>
                  <Input
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={t('reviewTitlePlaceholder')}
                    required
                    className="dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    {t('reviewComment')}
                  </label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder={t('reviewCommentPlaceholder')}
                    required
                    rows={4}
                    className="dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={addReviewMutation.isPending}>
                    {addReviewMutation.isPending ? t('submitting') : t('submitReview')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                    className="dark:border-gray-600"
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('noReviews')}</p>
              <p className="text-sm">{t('beFirstToReview')}</p>
            </div>
          ) : (
            reviews.map((review: Review) => (
              <Card key={review.id} className="dark:bg-gray-700/30 dark:border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarContent>
                        <User className="h-5 w-5" />
                      </AvatarContent>
                      <AvatarFallback>
                        {review.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium dark:text-white">
                          {review.userName}
                        </span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            {t('verified')}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mb-2">{renderStars(review.rating)}</div>

                      <h4 className="font-medium mb-2 dark:text-white">
                        {review.title}
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {review.comment}
                      </p>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => helpfulMutation.mutate(review.id)}
                          className="text-gray-500 dark:text-gray-400 hover:text-primary"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {t('helpful')} ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}