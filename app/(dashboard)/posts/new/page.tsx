'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { BackButton } from '@/components/ui/BackButton';
import { mockProjects } from '@/data/projectMockData';
import { Upload, FileText, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { PostType } from '@/types';

export default function CreatePostPage() {
  const router = useRouter();
  const [postType, setPostType] = useState<PostType>('text');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!content.trim()) {
      alert('Please enter post content');
      return;
    }
    if (content.length > 500) {
      alert('Content must be 500 characters or less');
      return;
    }
    if (!projectId) {
      alert('Please select a project');
      return;
    }
    if ((postType === 'photo' || postType === 'video') && !mediaFile) {
      alert(`Please upload a ${postType}`);
      return;
    }

    // In a real app, this would make an API call
    console.log('Creating post:', {
      type: postType,
      content,
      projectId,
      mediaFile,
      status,
    });

    alert('Post created successfully!');
    router.push('/posts');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (postType === 'photo' && !file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (postType === 'video' && !file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      setMediaFile(file);
    }
  };

  const characterCount = content.length;
  const characterLimit = 500;
  const isOverLimit = characterCount > characterLimit;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
          <p className="text-gray-600 mt-1">
            Share updates about your projects with the community
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form Card */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPostType('text')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    postType === 'text'
                      ? 'border-kanyini-primary bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className={`w-6 h-6 ${postType === 'text' ? 'text-kanyini-primary' : 'text-gray-400'}`} />
                  <span className={`font-medium ${postType === 'text' ? 'text-kanyini-primary' : 'text-gray-600'}`}>
                    Text
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostType('photo')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    postType === 'photo'
                      ? 'border-kanyini-primary bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ImageIcon className={`w-6 h-6 ${postType === 'photo' ? 'text-kanyini-primary' : 'text-gray-400'}`} />
                  <span className={`font-medium ${postType === 'photo' ? 'text-kanyini-primary' : 'text-gray-600'}`}>
                    Photo
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostType('video')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    postType === 'video'
                      ? 'border-kanyini-primary bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Video className={`w-6 h-6 ${postType === 'video' ? 'text-kanyini-primary' : 'text-gray-400'}`} />
                  <span className={`font-medium ${postType === 'video' ? 'text-kanyini-primary' : 'text-gray-600'}`}>
                    Video
                  </span>
                </button>
              </div>
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Project <span className="text-red-500">*</span>
              </label>
              <Select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                options={[
                  { value: '', label: 'Select a project' },
                  ...mockProjects.map((project) => ({
                    value: project.id,
                    label: project.name,
                  })),
                ]}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share what's happening with your project..."
                rows={6}
                required
                className={isOverLimit ? 'border-red-500 focus:border-red-500' : ''}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                  Max 500 characters for better readability
                </p>
                <p className={`text-sm font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
                  {characterCount} / {characterLimit}
                </p>
              </div>
              {isOverLimit && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">Content exceeds character limit</p>
                </div>
              )}
            </div>

            {/* Media Upload */}
            {(postType === 'photo' || postType === 'video') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload {postType === 'photo' ? 'Photo' : 'Video'} <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {mediaFile ? (
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {postType === 'photo' ? (
                          <ImageIcon className="w-6 h-6 text-kanyini-primary" />
                        ) : (
                          <Video className="w-6 h-6 text-kanyini-primary" />
                        )}
                        <span className="font-medium text-gray-900">{mediaFile.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {(mediaFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setMediaFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {postType === 'photo' ? 'PNG, JPG up to 10MB' : 'MP4, MOV up to 100MB'}
                      </p>
                      <input
                        type="file"
                        accept={postType === 'photo' ? 'image/*' : 'video/*'}
                        onChange={handleFileChange}
                        className="hidden"
                        id="media-upload"
                      />
                      <label htmlFor="media-upload" className="cursor-pointer">
                        <span className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-kanyini-primary text-white hover:bg-green-700 transition">
                          Choose File
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { value: 'Draft', label: 'Save as Draft' },
                  { value: 'Published', label: 'Publish Immediately' },
                ]}
              />
              <p className="text-sm text-gray-600 mt-2">
                {status === 'Draft' 
                  ? 'Post will be saved but not visible to users' 
                  : 'Post will be immediately visible on KC app'}
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/posts')}
          >
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setStatus('Draft');
                handleSubmit(new Event('submit') as any);
              }}
            >
              Save as Draft
            </Button>
            <Button type="submit">
              {status === 'Published' ? 'Publish Post' : 'Create Post'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

