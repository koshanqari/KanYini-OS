'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { mockContent } from '@/data/damMockData';
import Image from 'next/image';
import { 
  FileText, 
  BookOpen, 
  Video, 
  Mic, 
  Eye, 
  Calendar, 
  User, 
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  ExternalLink
} from 'lucide-react';

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const asset = mockContent.find(c => c.id === params.id);

  if (!asset) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Asset Not Found</h2>
          <p className="text-gray-600 mb-4">The asset you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/dam/content')}>
            Back to Assets
          </Button>
        </div>
      </div>
    );
  }

  const getTypeIcon = () => {
    switch (asset.type) {
      case 'article': return <FileText className="w-5 h-5" />;
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'podcast': return <Mic className="w-5 h-5" />;
    }
  };

  const getStatusBadge = () => {
    const statusMap = {
      published: { variant: 'success' as const, label: 'Published' },
      approved: { variant: 'info' as const, label: 'Approved' },
      under_review: { variant: 'warning' as const, label: 'Under Review' },
      draft: { variant: 'default' as const, label: 'Draft' },
      rejected: { variant: 'error' as const, label: 'Rejected' },
      archived: { variant: 'default' as const, label: 'Archived' },
    };
    const status = statusMap[asset.status] || statusMap.draft;
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <BackButton href="/dam/content" label="Back to Assets" />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {getTypeIcon()}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{asset.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{asset.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
              </div>
              {asset.views !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{asset.views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <Button 
            variant="secondary"
            onClick={() => router.push(`/dam/content/${asset.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      {asset.coverImage && (
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={asset.coverImage}
                alt={asset.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{asset.description}</p>
        </CardContent>
      </Card>

      {/* Type-specific Content */}
      {asset.type === 'article' && asset.articleContent && (
        <Card>
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: asset.articleContent }}
            />
            {asset.estimatedReadTime && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated read time: {asset.estimatedReadTime} minutes</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {asset.type === 'book' && (
        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {asset.isbn && (
                <div>
                  <span className="text-sm font-medium text-gray-700">ISBN:</span>
                  <p className="text-gray-900">{asset.isbn}</p>
                </div>
              )}
              {asset.publisher && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Publisher:</span>
                  <p className="text-gray-900">{asset.publisher}</p>
                </div>
              )}
              {asset.publishYear && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Published:</span>
                  <p className="text-gray-900">{asset.publishYear}</p>
                </div>
              )}
              {asset.pageCount && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Pages:</span>
                  <p className="text-gray-900">{asset.pageCount}</p>
                </div>
              )}
              {asset.bookPdfUrl && (
                <div>
                  <Button
                    variant="primary"
                    onClick={() => window.open(asset.bookPdfUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View PDF/eBook
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {asset.type === 'video' && asset.videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {asset.videoUrl.includes('youtube.com') || asset.videoUrl.includes('youtu.be') ? (
                  <iframe
                    className="w-full h-full"
                    src={asset.videoUrl.replace('watch?v=', 'embed/')}
                    title={asset.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video className="w-full h-full" controls>
                    <source src={asset.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {asset.videoDuration && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {Math.floor(asset.videoDuration / 60)}:{(asset.videoDuration % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {asset.type === 'podcast' && asset.podcastUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Podcast Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <audio className="w-full" controls>
                <source src={asset.podcastUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {asset.seriesName && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Series:</span>
                    <p className="text-gray-900">{asset.seriesName}</p>
                  </div>
                )}
                {asset.episodeNumber && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Episode:</span>
                    <p className="text-gray-900">#{asset.episodeNumber}</p>
                  </div>
                )}
                {asset.podcastDuration && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Duration:</span>
                    <p className="text-gray-900">{Math.floor(asset.podcastDuration / 60)}:{(asset.podcastDuration % 60).toString().padStart(2, '0')}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags & Category */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Category:</span>
              <Badge variant="info">{asset.category}</Badge>
            </div>
            {asset.tags && asset.tags.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 mb-2 block">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {asset.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Publishing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Created:</span>
              <p className="text-gray-900">{new Date(asset.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Last Updated:</span>
              <p className="text-gray-900">{new Date(asset.updatedAt).toLocaleString()}</p>
            </div>
            {asset.publishedAt && (
              <div>
                <span className="text-sm font-medium text-gray-700">Published:</span>
                <p className="text-gray-900">{new Date(asset.publishedAt).toLocaleString()}</p>
              </div>
            )}
            {asset.reviewedBy && (
              <div>
                <span className="text-sm font-medium text-gray-700">Reviewed By:</span>
                <p className="text-gray-900">{asset.reviewedBy}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions for Under Review */}
      {asset.status === 'under_review' && (
        <Card>
          <CardHeader>
            <CardTitle>Review Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="primary">
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              <Button variant="danger">
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

