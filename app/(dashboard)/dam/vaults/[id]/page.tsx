'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { mockVaults, mockUsers } from '@/data/damMockData';
import { 
  Globe, 
  Lock, 
  Users,
  FolderOpen,
  Plus,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  File,
  Edit,
  Trash2,
  Download,
  Eye,
  X,
  Link as LinkIcon,
  FileCheck
} from 'lucide-react';

export default function VaultDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'categories' | 'access'>('categories');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const vault = mockVaults.find(v => v.id === params.id);

  if (!vault) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vault Not Found</h2>
          <p className="text-gray-600 mb-4">The vault you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/dam/vaults')}>
            Back to Vaults
          </Button>
        </div>
      </div>
    );
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getTotalItems = () => {
    return vault.categories.reduce((acc, cat) => acc + cat.items.length, 0);
  };

  const getVisibilityIcon = () => {
    switch (vault.visibility) {
      case 'public': return <Globe className="w-5 h-5 text-green-600" />;
      case 'private': return <Lock className="w-5 h-5 text-gray-600" />;
      case 'restricted': return <Users className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getVisibilityBadge = () => {
    const map = {
      public: { variant: 'success' as const, label: 'Public' },
      private: { variant: 'default' as const, label: 'Private' },
      restricted: { variant: 'warning' as const, label: 'Restricted' },
    };
    const v = map[vault.visibility];
    return <Badge variant={v.variant}>{v.label}</Badge>;
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'document': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'pdf': return <FileCheck className="w-5 h-5 text-red-500" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-green-500" />;
      case 'file': return <File className="w-5 h-5 text-gray-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      <BackButton href="/dam/vaults" label="Back to Vaults" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{vault.name}</h1>
          <p className="text-gray-600 mb-3">{vault.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getVisibilityIcon()}
              {getVisibilityBadge()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Created by {vault.createdBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(vault.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Edit className="w-4 h-4" />
            Edit Vault
          </Button>
          <Button variant="danger">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tags */}
      {vault.tags && vault.tags.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-600" />
              <div className="flex flex-wrap gap-2">
                {vault.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'categories'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Categories ({vault.categories.length})
          </button>
          {vault.visibility === 'restricted' && (
            <button
              onClick={() => setActiveTab('access')}
              className={`pb-4 px-2 font-medium transition ${
                activeTab === 'access'
                  ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              User Access ({vault.allowedUsers?.length || 0})
            </button>
          )}
        </div>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Categories ({vault.categories.length})
            </h2>
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

        {vault.categories.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-4">Create categories to organize your files</p>
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Create First Category
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {vault.categories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="info">
                      {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Add item to category - Coming soon!');
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {expandedCategories.includes(category.id) && (
                  <CardContent className="p-4 space-y-3">
                    {category.items.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No items in this category</p>
                    ) : (
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {getItemTypeIcon(item.type)}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span>{formatFileSize(item.fileSize)}</span>
                                  {item.format && (
                                    <>
                                      <span>•</span>
                                      <span className="uppercase">{item.format}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>Uploaded by {item.uploadedBy}</span>
                                  <span>•</span>
                                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="secondary">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="danger">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
        </div>
      )}

      {/* Access Control Tab */}
      {activeTab === 'access' && vault.visibility === 'restricted' && vault.allowedUsers && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              User Access ({vault.allowedUsers.length})
            </h2>
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  This vault is restricted to the following users:
                </p>
                <div className="space-y-3">
                  {vault.allowedUsers.map((userId) => {
                    const user = mockUsers.find(u => u.id === userId);
                    if (!user) return null;
                    
                    return (
                      <div key={userId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{user.email}</span>
                          <Button size="sm" variant="danger">
                            <X className="w-3 h-3" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Total Users:</span>
                  <p className="text-2xl font-bold text-gray-900">{vault.allowedUsers.length}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Categories:</span>
                  <p className="text-2xl font-bold text-gray-900">{vault.categories.length}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Total Items:</span>
                  <p className="text-2xl font-bold text-gray-900">{getTotalItems()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vault Info */}
      <Card>
        <CardHeader>
          <CardTitle>Vault Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Categories:</span>
              <p className="text-gray-900">{vault.categories.length}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Total Items:</span>
              <p className="text-gray-900">{getTotalItems()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Created:</span>
              <p className="text-gray-900">{new Date(vault.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Last Updated:</span>
              <p className="text-gray-900">{new Date(vault.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
