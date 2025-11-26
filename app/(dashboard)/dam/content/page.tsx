'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockContent } from '@/data/damMockData';
import { 
  Plus, 
  Search, 
  FileText,
  BookOpen,
  Video,
  Mic,
  Eye,
  Edit,
  Check,
  X,
  Clock
} from 'lucide-react';
import { ContentType, ContentStatus } from '@/types';

export default function ContentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');

  // Stats
  const allContent = mockContent;
  const articles = mockContent.filter(c => c.type === 'article');
  const videos = mockContent.filter(c => c.type === 'video');
  const podcasts = mockContent.filter(c => c.type === 'podcast');
  const books = mockContent.filter(c => c.type === 'book');
  const pendingReview = mockContent.filter(c => c.status === 'under_review');

  // Filtered content
  const filteredContent = mockContent.filter(content => {
    const matchesTab = activeTab === 'all' || content.type === activeTab;
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    return matchesTab && matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: ContentStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'published': return 'success';
      case 'approved': return 'info';
      case 'under_review': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case 'article': return FileText;
      case 'book': return BookOpen;
      case 'video': return Video;
      case 'podcast': return Mic;
    }
  };

  const tabs = [
    { id: 'all' as const, label: 'All Assets', count: allContent.length },
    { id: 'article' as const, label: 'Articles', count: articles.length },
    { id: 'video' as const, label: 'Videos', count: videos.length },
    { id: 'podcast' as const, label: 'Podcasts', count: podcasts.length },
    { id: 'book' as const, label: 'Books', count: books.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asset Management</h2>
          <p className="text-gray-600 mt-1">Manage articles, videos, podcasts, and publications</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/dam/content/new')}>
          <Plus className="w-4 h-4" />
          Create Asset
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{allContent.length}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Articles</p>
                <p className="text-2xl font-bold text-blue-600">{articles.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Videos</p>
                <p className="text-2xl font-bold text-purple-600">{videos.length}</p>
              </div>
              <Video className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Podcasts</p>
                <p className="text-2xl font-bold text-green-600">{podcasts.length}</p>
              </div>
              <Mic className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReview.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent>
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-kanyini-primary text-kanyini-primary'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'all')}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'published', label: 'Published' },
                { value: 'approved', label: 'Approved' },
                { value: 'under_review', label: 'Under Review' },
                { value: 'draft', label: 'Draft' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              className="w-48"
            />
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {filteredContent.map((content) => {
              const Icon = getContentIcon(content.type);
              return (
                <div 
                  key={content.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/dam/content/${content.id}`)}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {content.thumbnailUrl ? (
                        <Image 
                          src={content.thumbnailUrl} 
                          alt={content.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded"
                          unoptimized
                        />
                      ) : (
                        <Icon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {content.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {content.description}
                          </p>
                        </div>
                        <Badge variant={getStatusVariant(content.status)}>
                          {content.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Icon className="w-4 h-4" />
                          {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                        </span>
                        <span>•</span>
                        <span>By {content.author}</span>
                        <span>•</span>
                        <span>{content.createdAt.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>
                          <Eye className="w-4 h-4 inline mr-1" />
                          {content.views} views
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {content.tags.map(tag => (
                          <Badge key={tag} variant="info" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dam/content/${content.id}`);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dam/content/${content.id}/edit`);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        {content.status === 'under_review' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Approve functionality - Coming soon!');
                              }}
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Reject functionality - Coming soon!');
                              }}
                            >
                              <X className="w-3 h-3" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No results */}
          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

