'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockPosts } from '@/data/postMockData';
import { 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon, 
  Video, 
  FileText,
  CheckCircle,
  XCircle,
  EyeOff,
  Eye,
  AlertTriangle,
  UserX,
  Trash2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { PostStatus, PostType } from '@/types';

export default function PostsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PostStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | PostType>('All');
  const [projectFilter, setProjectFilter] = useState('All');

  // Filter posts
  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch = 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || post.status === statusFilter;
    const matchesType = typeFilter === 'All' || post.type === typeFilter;
    const matchesProject = projectFilter === 'All' || post.projectName === projectFilter;

    return matchesSearch && matchesStatus && matchesType && matchesProject;
  });

  // Get unique projects for filter
  const projects = ['All', ...Array.from(new Set(mockPosts.map(p => p.projectName)))];

  // Stats
  const stats = {
    total: mockPosts.length,
    active: mockPosts.filter(p => p.status === 'Active').length,
    flagged: mockPosts.filter(p => p.status === 'Flagged').length,
    hidden: mockPosts.filter(p => p.status === 'Hidden').length,
    removed: mockPosts.filter(p => p.status === 'Removed').length,
  };

  const getStatusVariant = (status: PostStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Flagged':
        return 'warning';
      case 'Hidden':
        return 'default';
      case 'Removed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: PostType) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleModeration = (postId: string, action: 'approve' | 'hide' | 'remove' | 'block') => {
    console.log(`Moderating post ${postId}:`, action);
    alert(`Post ${action} action - Coming soon!`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Posts Moderation</h1>
          <p className="text-gray-600 mt-1">
            Review and moderate user-generated posts from KC app
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.flagged}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hidden</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.hidden}</p>
            </div>
            <EyeOff className="w-8 h-8 text-gray-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Removed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.removed}</p>
            </div>
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'All')}
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Flagged', label: 'Flagged' },
              { value: 'Hidden', label: 'Hidden' },
              { value: 'Removed', label: 'Removed' },
            ]}
            className="w-48"
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as PostType | 'All')}
            options={[
              { value: 'All', label: 'All Types' },
              { value: 'text', label: 'Text' },
              { value: 'photo', label: 'Photo' },
              { value: 'video', label: 'Video' },
            ]}
            className="w-48"
          />
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            options={projects.map(p => ({ value: p, label: p }))}
            className="w-64"
          />
        </div>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card 
            key={post.id}
            className={`p-6 hover:shadow-lg transition cursor-pointer ${
              post.status === 'Flagged' ? 'border-l-4 border-yellow-500' : ''
            } ${
              post.isUserBlocked ? 'bg-red-50' : ''
            }`}
            onClick={() => router.push(`/posts/${post.id}`)}
          >
            <div className="flex gap-4">
              {/* Media Thumbnail */}
              {(post.type === 'photo' || post.type === 'video') && (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {post.mediaUrl && (
                    <Image
                      src={post.type === 'video' && post.mediaThumbnail ? post.mediaThumbnail : post.mediaUrl}
                      alt="Post media"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(post.status)}>
                      {getTypeIcon(post.type)}
                      {post.type}
                    </Badge>
                    <Badge variant={getStatusVariant(post.status)}>
                      {post.status}
                    </Badge>
                    {post.isUserBlocked && (
                      <Badge variant="error">
                        <UserX className="w-3 h-3" />
                        User Blocked
                      </Badge>
                    )}
                    {post.isFlagged && (
                      <Badge variant="warning">
                        <AlertTriangle className="w-3 h-3" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-gray-900 mb-3">{post.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="font-medium">{post.authorName}</span>
                  <span>•</span>
                  <span>{post.projectName}</span>
                  <span>•</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/posts/${post.id}`);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>

                    {post.status === 'Flagged' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModeration(post.id, 'approve');
                          }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModeration(post.id, 'hide');
                          }}
                        >
                          <EyeOff className="w-3 h-3" />
                          Hide
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModeration(post.id, 'remove');
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </Button>
                      </>
                    )}

                    {post.status === 'Active' && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModeration(post.id, 'hide');
                          }}
                        >
                          <EyeOff className="w-3 h-3" />
                          Hide
                        </Button>
                      </>
                    )}

                    {post.status === 'Hidden' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModeration(post.id, 'approve');
                        }}
                      >
                        <Eye className="w-3 h-3" />
                        Unhide
                      </Button>
                    )}

                    {!post.isUserBlocked && post.status !== 'Removed' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModeration(post.id, 'block');
                        }}
                      >
                        <UserX className="w-3 h-3" />
                        Block User
                      </Button>
                    )}
                  </div>
                </div>

                {post.isFlagged && post.flaggedReason && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">Flagged Reason:</p>
                        <p className="text-sm text-yellow-800">{post.flaggedReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <Card className="p-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}
