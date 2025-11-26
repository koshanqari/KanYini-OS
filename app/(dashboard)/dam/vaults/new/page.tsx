'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { mockAssets, mockContent } from '@/data/damMockData';
import { 
  Save, 
  Globe, 
  Lock, 
  Users, 
  FolderOpen,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  File,
  Plus,
  X
} from 'lucide-react';

export default function NewVaultPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private',
    icon: '📁',
    tags: [] as string[],
    selectedAssets: [] as string[],
    selectedContent: [] as string[],
    allowedUsers: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [newUserId, setNewUserId] = useState('');

  const icons = ['📁', '🗂️', '📂', '🗄️', '📚', '📖', '🎓', '🌍', '💼', '🎨', '📸', '🎬', '🎵', '📰', '🏛️', '🌟'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating vault:', formData);
    alert('Vault created successfully! (Demo)');
    router.push('/dam/vaults');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddUser = () => {
    if (newUserId.trim() && !formData.allowedUsers.includes(newUserId.trim())) {
      setFormData(prev => ({
        ...prev,
        allowedUsers: [...prev.allowedUsers, newUserId.trim()]
      }));
      setNewUserId('');
    }
  };

  const handleRemoveUser = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      allowedUsers: prev.allowedUsers.filter(id => id !== userId)
    }));
  };

  const toggleAsset = (assetId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(assetId)
        ? prev.selectedAssets.filter(id => id !== assetId)
        : [...prev.selectedAssets, assetId]
    }));
  };

  const toggleContent = (contentId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedContent: prev.selectedContent.includes(contentId)
        ? prev.selectedContent.filter(id => id !== contentId)
        : [...prev.selectedContent, contentId]
    }));
  };

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'video': return <Video className="w-4 h-4 text-purple-500" />;
      case 'audio': return <Music className="w-4 h-4 text-pink-500" />;
      case 'document': return <File className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BackButton href="/dam/vaults" label="Back to Vaults" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Vault</h1>
          <p className="text-gray-600 mt-1">
            Organize your assets and content into a secure vault
          </p>
        </div>
        <Button type="submit">
          <Save className="w-4 h-4" />
          Create Vault
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vault Name *
            </label>
            <Input
              type="text"
              placeholder="e.g., Event Resources, Fellowship Materials"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kanyini-primary focus:border-transparent"
              rows={3}
              placeholder="Describe what this vault contains..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-12 h-12 text-2xl rounded-lg border-2 transition ${
                    formData.icon === icon
                      ? 'border-kanyini-primary bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility *
            </label>
            <Select
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              options={[
                { value: 'private', label: '🔒 Private - Only you can access' },
                { value: 'public', label: '🌍 Public - Anyone can access' },
                { value: 'restricted', label: '👥 Restricted - Specific users only' },
              ]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="info" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      {formData.visibility === 'restricted' && (
        <Card>
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Specify which users can access this vault
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter user ID..."
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUser())}
              />
              <Button type="button" onClick={handleAddUser} variant="secondary">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.allowedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.allowedUsers.map((userId) => (
                  <Badge key={userId} variant="info" className="flex items-center gap-1">
                    User ID: {userId}
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(userId)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Add Assets (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Select raw assets to include in this vault
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {mockAssets.map((asset) => (
              <label
                key={asset.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedAssets.includes(asset.id)}
                  onChange={() => toggleAsset(asset.id)}
                  className="w-4 h-4"
                />
                {getAssetTypeIcon(asset.type)}
                <span className="flex-1 text-sm font-medium text-gray-900">
                  {asset.name}
                </span>
                <Badge variant="default" className="text-xs">
                  {asset.type}
                </Badge>
              </label>
            ))}
          </div>
          {formData.selectedAssets.length > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              {formData.selectedAssets.length} asset(s) selected
            </p>
          )}
        </CardContent>
      </Card>

      {/* Add Content */}
      <Card>
        <CardHeader>
          <CardTitle>Add Published Content (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Select published content to include in this vault
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {mockContent.map((content) => (
              <label
                key={content.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedContent.includes(content.id)}
                  onChange={() => toggleContent(content.id)}
                  className="w-4 h-4"
                />
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="flex-1 text-sm font-medium text-gray-900">
                  {content.title}
                </span>
                <Badge variant={content.status === 'published' ? 'success' : 'warning'} className="text-xs">
                  {content.type}
                </Badge>
              </label>
            ))}
          </div>
          {formData.selectedContent.length > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              {formData.selectedContent.length} content item(s) selected
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dam/vaults')}
        >
          Cancel
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4" />
          Create Vault
        </Button>
      </div>
    </form>
  );
}
