'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { BackButton } from '@/components/ui/BackButton';
import { FileText, BookOpen, Video, Mic, Upload, Image as ImageIcon } from 'lucide-react';

export default function CreateAssetPage() {
  const router = useRouter();
  const [assetType, setAssetType] = useState<'article' | 'book' | 'video' | 'podcast'>('article');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    tags: '',
    thumbnailUrl: '',
    coverImageUrl: '',
    status: 'draft',
    
    // Article specific
    articleContent: '',
    estimatedReadTime: '',
    
    // Book specific
    isbn: '',
    pageCount: '',
    publisher: '',
    publishYear: '',
    bookPdfUrl: '',
    
    // Video specific
    videoUrl: '',
    videoDuration: '',
    
    // Podcast specific
    podcastUrl: '',
    podcastDuration: '',
    episodeNumber: '',
    seriesName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating asset:', { type: assetType, ...formData });
    alert('Asset created successfully! (This is a prototype)');
    router.push('/dam/content');
  };

  const assetTypes = [
    { value: 'article', label: 'Article', icon: FileText, description: 'Blog post or journal article' },
    { value: 'book', label: 'Book', icon: BookOpen, description: 'Published book or e-book' },
    { value: 'video', label: 'Video', icon: Video, description: 'Documentary or video content' },
    { value: 'podcast', label: 'Podcast', icon: Mic, description: 'Audio episode or series' },
  ];

  return (
    <div className="space-y-6">
      <BackButton href="/dam/content" label="Back to Assets" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Asset</h2>
          <p className="text-gray-600 mt-1">Add content for the website and platforms</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asset Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Asset Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {assetTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = assetType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setAssetType(type.value as any)}
                    className={`p-4 border-2 rounded-lg transition ${
                      isSelected
                        ? 'border-kanyini-primary bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      isSelected ? 'text-kanyini-primary' : 'text-gray-400'
                    }`} />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {type.label}
                    </p>
                    <p className="text-xs text-gray-600">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter asset title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description or excerpt"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    options={[
                      { value: '', label: 'Select category' },
                      { value: 'Philosophy', label: 'Philosophy' },
                      { value: 'Environment', label: 'Environment' },
                      { value: 'Culture', label: 'Culture' },
                      { value: 'Science', label: 'Science' },
                      { value: 'Stories', label: 'Stories' },
                      { value: 'Education', label: 'Education' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Enter tags separated by commas (e.g., philosophy, sustainability)"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media/Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  Recommended: 800x450px for thumbnails
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <Input
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... (optional)"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Recommended: 1920x1080px for cover images
                </p>
              </div>

              {/* Preview */}
              {formData.thumbnailUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="w-full max-w-sm h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image 
                      src={formData.thumbnailUrl} 
                      alt="Preview"
                      width={384}
                      height={192}
                      className="w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x450/597242/ffffff?text=Image+Error';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Type-specific fields */}
        {assetType === 'article' && (
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Content <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.articleContent}
                    onChange={(e) => setFormData({ ...formData, articleContent: e.target.value })}
                    placeholder="Write your article content here (HTML supported)..."
                    rows={12}
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    You can use HTML tags for formatting
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Read Time (minutes)
                  </label>
                  <Input
                    type="number"
                    value={formData.estimatedReadTime}
                    onChange={(e) => setFormData({ ...formData, estimatedReadTime: e.target.value })}
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {assetType === 'book' && (
          <Card>
            <CardHeader>
              <CardTitle>Book Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISBN
                    </label>
                    <Input
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      placeholder="978-0-xxx-xxxxx-x"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Count
                    </label>
                    <Input
                      type="number"
                      value={formData.pageCount}
                      onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                      placeholder="e.g., 312"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publisher
                    </label>
                    <Input
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      placeholder="Publisher name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Year
                    </label>
                    <Input
                      type="number"
                      value={formData.publishYear}
                      onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF/eBook URL
                  </label>
                  <Input
                    value={formData.bookPdfUrl}
                    onChange={(e) => setFormData({ ...formData, bookPdfUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {assetType === 'video' && (
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or embed URL"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    YouTube, Vimeo, or direct video file URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (seconds)
                  </label>
                  <Input
                    type="number"
                    value={formData.videoDuration}
                    onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                    placeholder="e.g., 1122 (18:42)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {assetType === 'podcast' && (
          <Card>
            <CardHeader>
              <CardTitle>Podcast Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio URL <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.podcastUrl}
                    onChange={(e) => setFormData({ ...formData, podcastUrl: e.target.value })}
                    placeholder="https://... (.mp3 or streaming URL)"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Series Name
                    </label>
                    <Input
                      value={formData.seriesName}
                      onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
                      placeholder="e.g., KanYini Conversations"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Episode Number
                    </label>
                    <Input
                      type="number"
                      value={formData.episodeNumber}
                      onChange={(e) => setFormData({ ...formData, episodeNumber: e.target.value })}
                      placeholder="e.g., 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (seconds)
                    </label>
                    <Input
                      type="number"
                      value={formData.podcastDuration}
                      onChange={(e) => setFormData({ ...formData, podcastDuration: e.target.value })}
                      placeholder="e.g., 1845"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Publishing Status */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'draft', label: 'Save as Draft' },
                  { value: 'under_review', label: 'Submit for Review' },
                  { value: 'approved', label: 'Approve (ready to publish)' },
                  { value: 'published', label: 'Publish to Website' },
                ]}
              />
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {formData.status === 'draft' && 'Asset will be saved but not visible on the website'}
                  {formData.status === 'under_review' && 'Asset will be submitted for editorial review'}
                  {formData.status === 'approved' && 'Asset is approved but not yet published'}
                  {formData.status === 'published' && 'Asset will be immediately visible on the website'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => router.push('/dam/content')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
          >
            <Upload className="w-4 h-4" />
            Create {assetType.charAt(0).toUpperCase() + assetType.slice(1)}
          </Button>
        </div>
      </form>
    </div>
  );
}

