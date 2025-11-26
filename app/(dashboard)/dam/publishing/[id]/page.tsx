'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { mockSocialPosts } from '@/data/damMockData';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Calendar,
  User,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  BarChart3
} from 'lucide-react';
import { SocialPlatform, PublishStatus } from '@/types';

export default function PublishingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const post = mockSocialPosts.find(p => p.id === params.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'platforms'>('overview');

  if (!post) {
    return (
      <div className="space-y-6">
        <BackButton href="/dam/publishing" label="Back to Publishing" />
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Post not found</h3>
            <p className="text-gray-600 mb-4">The post you are looking for does not exist.</p>
            <Button onClick={() => router.push('/dam/publishing')}>
              Back to Publishing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusVariant = (status: PublishStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'info';
      case 'publishing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'linkedin': return Linkedin;
      case 'youtube': return Youtube;
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook': return 'text-blue-600 bg-blue-50';
      case 'instagram': return 'text-pink-600 bg-pink-50';
      case 'twitter': return 'text-blue-400 bg-blue-50';
      case 'linkedin': return 'text-blue-700 bg-blue-50';
      case 'youtube': return 'text-red-600 bg-red-50';
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      alert('Post deleted successfully! (This is a prototype)');
      router.push('/dam/publishing');
    }
  };

  const handleDuplicate = () => {
    alert('Post duplicated! (This is a prototype)');
  };

  return (
    <div className="space-y-6">
      <BackButton href="/dam/publishing" label="Back to Publishing" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(post.status)} className="text-sm">
            {post.status}
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900">Social Media Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleDuplicate}>
            <Copy className="w-4 h-4" />
            Duplicate
          </Button>
          <Button variant="secondary" size="sm" onClick={() => router.push(`/dam/publishing/${post.id}/edit`)}>
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'overview'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          {post.status === 'published' && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-2 font-medium transition ${
                activeTab === 'analytics'
                  ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          )}
          <button
            onClick={() => setActiveTab('platforms')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'platforms'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Platform Details
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
              <div className="mt-4 text-sm text-gray-600">
                {post.content.length} characters
              </div>
            </CardContent>
          </Card>

          {/* Media Preview */}
          {post.mediaUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden relative w-full" style={{ maxHeight: '384px' }}>
                  <Image 
                    src={post.mediaUrl} 
                    alt="Post media" 
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-96 object-cover"
                    unoptimized
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platforms */}
          <Card>
            <CardHeader>
              <CardTitle>Target Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {post.platforms.map(platform => {
                  const Icon = getPlatformIcon(platform);
                  const colorClass = getPlatformColor(platform);
                  return (
                    <div
                      key={platform}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colorClass}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Created by {post.createdBy}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    Created on {post.createdAt.toLocaleDateString()}
                  </span>
                </div>
                {post.status === 'scheduled' && post.scheduledFor && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">
                      Scheduled for {post.scheduledFor.toLocaleString()}
                    </span>
                  </div>
                )}
                {post.status === 'published' && post.publishedAt && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      Published on {post.publishedAt.toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {post.status === 'published' && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {post.totalReach && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Eye className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Total Reach</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">
                        {post.totalReach.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {post.totalEngagement && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Total Engagement</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {post.totalEngagement.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {post.totalReach && post.totalEngagement && (
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-gray-600">Engagement Rate</span>
                      <span className="text-lg font-bold text-gray-900">
                        {((post.totalEngagement / post.totalReach) * 100).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && post.status === 'published' && (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Reach</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {post.totalReach?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Engagement</p>
                    <p className="text-2xl font-bold text-green-600">
                      {post.totalEngagement?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {post.totalReach && post.totalEngagement
                        ? `${((post.totalEngagement / post.totalReach) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Platforms</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {post.platforms.length}
                    </p>
                  </div>
                  <Share2 className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Breakdown */}
          {post.platformData && post.platformData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {post.platformData.map((pd, idx) => {
                    const Icon = getPlatformIcon(pd.platform);
                    const colorClass = getPlatformColor(pd.platform);
                    return (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${colorClass}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 capitalize">
                                {pd.platform}
                              </h3>
                              {pd.publishedAt && (
                                <p className="text-sm text-gray-600">
                                  Published {pd.publishedAt.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          {pd.url && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => window.open(pd.url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Post
                            </Button>
                          )}
                        </div>
                        {pd.engagement && (
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Likes</p>
                              <p className="text-lg font-bold text-gray-900">
                                {pd.engagement.likes?.toLocaleString() || '0'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Comments</p>
                              <p className="text-lg font-bold text-gray-900">
                                {pd.engagement.comments?.toLocaleString() || '0'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Shares</p>
                              <p className="text-lg font-bold text-gray-900">
                                {pd.engagement.shares?.toLocaleString() || '0'}
                              </p>
                            </div>
                          </div>
                        )}
                        {pd.error && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg">
                            <p className="text-sm text-red-600">Error: {pd.error}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Platform Details Tab */}
      {activeTab === 'platforms' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform-Specific Information</CardTitle>
            </CardHeader>
            <CardContent>
              {post.platformData && post.platformData.length > 0 ? (
                <div className="space-y-4">
                  {post.platformData.map((pd, idx) => {
                    const Icon = getPlatformIcon(pd.platform);
                    const colorClass = getPlatformColor(pd.platform);
                    return (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${colorClass}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-medium text-gray-900 capitalize">
                                {pd.platform}
                              </h3>
                              {pd.postId && (
                                <p className="text-sm text-gray-600">
                                  Post ID: <code className="bg-gray-100 px-2 py-1 rounded">{pd.postId}</code>
                                </p>
                              )}
                              {pd.publishedAt && (
                                <p className="text-sm text-gray-600">
                                  Published: {pd.publishedAt.toLocaleString()}
                                </p>
                              )}
                              {pd.url && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => window.open(pd.url, '_blank')}
                                  className="mt-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View on {pd.platform}
                                </Button>
                              )}
                            </div>
                          </div>
                          {!pd.error ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        {pd.error && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg">
                            <p className="text-sm font-medium text-red-900 mb-1">
                              Publishing Error
                            </p>
                            <p className="text-sm text-red-600">{pd.error}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No platform-specific data available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

