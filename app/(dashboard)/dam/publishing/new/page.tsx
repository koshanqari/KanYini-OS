'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';
import { 
  Calendar,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Image as ImageIcon
} from 'lucide-react';

export default function NewPublishingPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    content: '',
    platforms: [] as string[],
    scheduledDate: '',
    scheduledTime: '',
    status: 'draft',
  });

  const platforms = [
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  ];

  const togglePlatform = (platformId: string) => {
    if (formData.platforms.includes(platformId)) {
      setFormData({
        ...formData,
        platforms: formData.platforms.filter(p => p !== platformId),
      });
    } else {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, platformId],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual post creation
    console.log('Creating post:', formData);
    alert('Post created successfully! (This is a prototype)');
    router.push('/dam/publishing');
  };

  const characterCount = formData.content.length;
  const twitterLimit = 280;
  const isOverTwitterLimit = characterCount > twitterLimit && formData.platforms.includes('twitter');

  return (
    <div className="space-y-6">
      <BackButton href="/dam/publishing" label="Back to Publishing" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Social Media Post</h2>
          <p className="text-gray-600 mt-1">Publish to multiple platforms at once</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Post Content */}
        <Card>
          <CardHeader>
            <CardTitle>Post Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What's happening? Share your story..."
              rows={6}
              required
              className="resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <div className={`text-sm ${isOverTwitterLimit ? 'text-red-600' : 'text-gray-600'}`}>
                {characterCount} characters
                {formData.platforms.includes('twitter') && (
                  <span> • Twitter limit: {twitterLimit}</span>
                )}
              </div>
              {isOverTwitterLimit && (
                <p className="text-sm text-red-600">
                  Content exceeds Twitter character limit
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Platforms *</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-4 border-2 rounded-lg transition ${
                      isSelected
                        ? 'border-kanyini-primary bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${platform.color}`} />
                    <p className="text-sm font-medium text-gray-900">
                      {platform.label}
                    </p>
                  </button>
                );
              })}
            </div>
            {formData.platforms.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                Please select at least one platform
              </p>
            )}
          </CardContent>
        </Card>

        {/* Media Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Media Attachments (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Add images or videos
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select from your asset library or upload new media
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => router.push('/dam/assets')}
                  >
                    Browse Assets
                  </Button>
                  <Button type="button" variant="secondary">
                    Upload New
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <p>Leave blank to save as draft or publish immediately</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => router.push('/dam/publishing')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              setFormData({ ...formData, status: 'draft' });
              handleSubmit(e as any);
            }}
            disabled={!formData.content || formData.platforms.length === 0}
          >
            Save as Draft
          </Button>
          {formData.scheduledDate && formData.scheduledTime ? (
            <Button 
              type="submit" 
              variant="primary"
              disabled={!formData.content || formData.platforms.length === 0 || isOverTwitterLimit}
            >
              Schedule Post
            </Button>
          ) : (
            <Button 
              type="submit" 
              variant="primary"
              disabled={!formData.content || formData.platforms.length === 0 || isOverTwitterLimit}
            >
              Publish Now
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

