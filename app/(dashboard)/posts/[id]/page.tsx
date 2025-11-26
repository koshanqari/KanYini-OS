'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { mockPosts } from '@/data/postMockData';
import { mockComments } from '@/data/postMockData';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  User,
  Calendar,
  Eye,
  EyeOff,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { PostStatus } from '@/types';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'hide' | 'remove'>('approve');
  const [moderationNotes, setModerationNotes] = useState('');

  const post = mockPosts.find((p) => p.id === params.id);
  const postComments = mockComments.filter((c) => c.postId === params.id);

  if (!post) {
    return (
      <div className="p-6">
        <Card className="p-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Post Not Found</h2>
            <p className="text-gray-600 mb-6">The post you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/posts')}>Back to Posts</Button>
          </div>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Flagged':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hidden':
        return 'bg-gray-100 text-gray-800';
      case 'Removed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleModeration = () => {
    console.log(`${moderationAction} post:`, {
      postId: post.id,
      notes: moderationNotes,
    });
    alert(`Post ${moderationAction}d successfully!`);
    setShowModerationModal(false);
    router.push('/posts');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Post Details</h1>
            <p className="text-gray-600 mt-1">View and moderate post content</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/posts/${post.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (confirm('Are you sure you want to delete this post?')) {
                alert('Post deleted!');
                router.push('/posts');
              }
            }}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Card */}
          <Card className="p-6">
            {/* Status & Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                <Badge className="bg-blue-100 text-blue-800 capitalize">{post.type}</Badge>
              </div>

              {post.status === 'Flagged' && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setModerationAction('approve');
                      setShowModerationModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setModerationAction('hide');
                      setShowModerationModal(true);
                    }}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setModerationAction('remove');
                      setShowModerationModal(true);
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Author & Date */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.authorName}</p>
                <p className="text-sm text-gray-600">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            {/* Media */}
            {post.mediaUrl && (
              <div className="mb-4 rounded-lg overflow-hidden">
                {post.type === 'photo' ? (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={post.mediaUrl}
                      alt="Post media"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : post.type === 'video' ? (
                  <div className="relative bg-gray-100 aspect-video">
                    <Image
                      src={post.mediaThumbnail || '/placeholder.jpg'}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-8 border-l-white border-y-6 border-y-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Content */}
            <p className="text-gray-900 text-lg mb-6 whitespace-pre-wrap">{post.content}</p>

            {/* Engagement Stats */}
            <div className="flex items-center gap-8 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{post.likes}</span>
                <span className="text-sm text-gray-600">Likes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{post.comments}</span>
                <span className="text-sm text-gray-600">Comments</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{post.shares}</span>
                <span className="text-sm text-gray-600">Shares</span>
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comments ({postComments.length})
            </h3>

            {postComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No comments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {postComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.userName}</span>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{comment.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Linked Project</p>
                <p className="font-medium text-kanyini-primary cursor-pointer hover:underline"
                   onClick={() => router.push(`/projects/${post.projectId}`)}>
                  {post.projectName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Author</p>
                <p className="font-medium text-gray-900">{post.authorName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Views</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Eye className="w-4 h-4" />
                  <span>{post.likes * 10 + post.comments * 5}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Engagement Analytics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="font-medium text-gray-900">
                    {((post.likes + post.comments + post.shares) / 100 * 10).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-kanyini-primary h-2 rounded-full"
                    style={{ width: `${Math.min((post.likes + post.comments + post.shares) / 100 * 10, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">High engagement</span>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Likes</span>
                  <span className="font-medium">{post.likes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-medium">{post.comments}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shares</span>
                  <span className="font-medium">{post.shares}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Moderation Info */}
          {post.moderatedBy && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderation</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Moderated By</p>
                  <p className="font-medium text-gray-900">{post.moderatedBy}</p>
                </div>
                {post.moderatedAt && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Moderated On</p>
                    <p className="font-medium text-gray-900">{formatDate(post.moderatedAt)}</p>
                  </div>
                )}
                {post.moderationNotes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                    <p className="text-gray-900">{post.moderationNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Moderation Modal */}
      <Modal
        isOpen={showModerationModal}
        onClose={() => setShowModerationModal(false)}
        title={`${moderationAction === 'approve' ? 'Approve' : 'Reject'} Post`}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {moderationAction === 'approve'
              ? 'Approving this post will make it visible to all users on the KC app.'
              : 'Rejecting this post will prevent it from being published. The author will be notified.'}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moderation Notes {moderationAction === 'remove' && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              value={moderationNotes}
              onChange={(e) => setModerationNotes(e.target.value)}
              placeholder={
                moderationAction === 'approve'
                  ? 'Add any notes about this approval (optional)'
                  : 'Please provide a reason for rejection'
              }
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowModerationModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleModeration}
              className={
                moderationAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {moderationAction === 'approve' ? 'Approve Post' : 'Reject Post'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

