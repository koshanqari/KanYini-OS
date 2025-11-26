'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { BackButton } from '@/components/ui/BackButton';
import { Upload, X, FileText, Image as ImageIcon, Video, Music } from 'lucide-react';

export default function UploadAssetsPage() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    tags: '',
    description: '',
    status: 'draft',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual upload logic
    console.log('Uploading files:', selectedFiles, 'with data:', formData);
    alert(`${selectedFiles.length} file(s) uploaded successfully! (This is a prototype)`);
    router.push('/dam/assets');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    return FileText;
  };

  return (
    <div className="space-y-6">
      <BackButton href="/dam/assets" label="Back to Assets" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Assets</h2>
          <p className="text-gray-600 mt-1">Add new digital assets to your library</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Select Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Supports: Images, Videos, Audio, Documents
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="primary" onClick={() => document.getElementById('file-upload')?.click()}>
                    Select Files
                  </Button>
                </label>
              </div>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Selected Files ({selectedFiles.length})
                </h4>
                {selectedFiles.map((file, index) => {
                  const Icon = getFileIcon(file.type);
                  return (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <Icon className="w-8 h-8 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  options={[
                    { value: '', label: 'Select a category' },
                    { value: 'Branding', label: 'Branding' },
                    { value: 'Campaigns', label: 'Campaigns' },
                    { value: 'Events', label: 'Events' },
                    { value: 'Reports', label: 'Reports' },
                    { value: 'Documentation', label: 'Documentation' },
                    { value: 'Podcasts', label: 'Podcasts' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags *
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Enter tags separated by commas (e.g., campaign, 2024, environment)"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  Add relevant tags to make assets easier to find
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe these assets..."
                  rows={4}
                />
              </div>

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
                    { value: 'approved', label: 'Mark as Approved' },
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => router.push('/dam/assets')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={selectedFiles.length === 0 || !formData.category || !formData.tags}
          >
            <Upload className="w-4 h-4" />
            Upload {selectedFiles.length > 0 && `${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      </form>
    </div>
  );
}

