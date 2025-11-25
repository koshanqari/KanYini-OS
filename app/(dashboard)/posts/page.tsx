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
  Plus, 
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
  Clock,
  Eye
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
    published: mockPosts.filter(p => p.status === 'Published').length,
    pending: mockPosts.filter(p => p.status === 'Pending Review').length,
    draft: mockPosts.filter(p => p.status === 'Draft').length,
  };

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts Management</h1>
          <p className="text-gray-600 mt-1">
            Moderate and manage community posts from KC app
          </p>
        </div>
        <Button
          onClick={() => router.push('/posts/new')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.published}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.draft}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by content, project, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-40"
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Published', label: 'Published' },
                { value: 'Pending Review', label: 'Pending Review' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Rejected', label: 'Rejected' },
              ]}
            />

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-32"
              options={[
                { value: 'All', label: 'All Types' },
                { value: 'text', label: 'Text' },
                { value: 'photo', label: 'Photo' },
                { value: 'video', label: 'Video' },
              ]}
            />

            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-48"
              options={projects.map((project) => ({
                value: project,
                label: project,
              }))}
            />
          </div>
        </div>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card 
            key={post.id} 
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/posts/${post.id}`)}
          >
            <div className="flex gap-6">
              {/* Media Thumbnail */}
              {post.mediaUrl && (
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={post.mediaThumbnail || post.mediaUrl}
                      alt="Post media"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getStatusColor(post.status)} flex items-center gap-1`}>
                        {getTypeIcon(post.type)}
                        {post.type}
                      </Badge>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-900 mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="font-medium text-kanyini-primary">
                        {post.projectName}
                      </span>
                      <span>by {post.authorName}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">{post.shares}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {post.status === 'Pending Review' && (
                      <>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle approve
                            alert('Approve post: ' + post.id);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle reject
                            alert('Reject post: ' + post.id);
                          }}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/posts/${post.id}`);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <Card className="p-12">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No posts found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

