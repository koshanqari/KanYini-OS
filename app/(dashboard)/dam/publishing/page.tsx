'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockSocialPosts } from '@/data/damMockData';
import { 
  Plus, 
  Search, 
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { PublishStatus, SocialPlatform } from '@/types';

export default function PublishingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PublishStatus | 'all'>('all');

  // Stats
  const totalPosts = mockSocialPosts.length;
  const published = mockSocialPosts.filter(p => p.status === 'published').length;
  const scheduled = mockSocialPosts.filter(p => p.status === 'scheduled').length;
  const drafts = mockSocialPosts.filter(p => p.status === 'draft').length;
  const totalReach = mockSocialPosts
    .filter(p => p.totalReach)
    .reduce((sum, p) => sum + (p.totalReach || 0), 0);

  // Filtered posts
  const filteredPosts = mockSocialPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      case 'facebook': return 'text-blue-600';
      case 'instagram': return 'text-pink-600';
      case 'twitter': return 'text-blue-400';
      case 'linkedin': return 'text-blue-700';
      case 'youtube': return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Publishing Hub</h2>
          <p className="text-gray-600 mt-1">Manage multi-platform social media posts</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/dam/publishing/new')}>
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
              </div>
              <Share2 className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{published}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{drafts}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(totalReach / 1000).toFixed(1)}K
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PublishStatus | 'all')}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'published', label: 'Published' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'draft', label: 'Drafts' },
                { value: 'failed', label: 'Failed' },
              ]}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card 
            key={post.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/dam/publishing/${post.id}`)}
          >
            <CardContent>
              <div className="flex items-start gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-gray-900 line-clamp-3">
                      {post.content}
                    </p>
                    <Badge variant={getStatusVariant(post.status)}>
                      {post.status}
                    </Badge>
                  </div>

                  {/* Platforms */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">Publishing to:</span>
                    {post.platforms.map(platform => {
                      const Icon = getPlatformIcon(platform);
                      const colorClass = getPlatformColor(platform);
                      return (
                        <div 
                          key={platform}
                          className="flex items-center gap-1 text-sm"
                        >
                          <Icon className={`w-4 h-4 ${colorClass}`} />
                          <span className={colorClass}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Created by {post.createdBy}</span>
                    <span>•</span>
                    {post.status === 'scheduled' && post.scheduledFor && (
                      <>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Scheduled for {post.scheduledFor.toLocaleString()}
                        </span>
                      </>
                    )}
                    {post.status === 'published' && post.publishedAt && (
                      <>
                        <span>Published {post.publishedAt.toLocaleDateString()}</span>
                        {post.totalReach && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {post.totalReach.toLocaleString()} reach
                            </span>
                          </>
                        )}
                        {post.totalEngagement && (
                          <>
                            <span>•</span>
                            <span>{post.totalEngagement.toLocaleString()} engagement</span>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Platform-specific status */}
                  {post.platformData && post.platformData.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-2">Platform Status:</div>
                      <div className="flex flex-wrap gap-2">
                        {post.platformData.map((pd, idx) => {
                          const Icon = getPlatformIcon(pd.platform);
                          return (
                            <div 
                              key={idx}
                              className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded"
                            >
                              <Icon className={`w-3 h-3 ${getPlatformColor(pd.platform)}`} />
                              <span>{pd.platform}</span>
                              {pd.error ? (
                                <span className="text-red-600">Failed</span>
                              ) : (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Asset Preview */}
                {post.mediaUrl && (
                  <div className="w-32 h-32 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                    <Image 
                      src={post.mediaUrl} 
                      alt="Post media" 
                      width={128}
                      height={128}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredPosts.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or create a new post
              </p>
              <Button 
                variant="primary"
                onClick={() => router.push('/dam/publishing/new')}
              >
                <Plus className="w-4 h-4" />
                Create Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

