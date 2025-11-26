'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockAssets } from '@/data/damMockData';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3x3, 
  List, 
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Download,
  Eye,
  MoreVertical,
  Upload
} from 'lucide-react';
import { AssetType, AssetStatus } from '@/types';

export default function AssetsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');

  // Stats
  const totalAssets = mockAssets.length;
  const approvedAssets = mockAssets.filter(a => a.status === 'approved').length;
  const pendingAssets = mockAssets.filter(a => a.status === 'under_review').length;
  const totalSize = mockAssets.reduce((sum, a) => sum + a.size, 0);

  // Filtered assets
  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const getStatusVariant = (status: AssetStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'approved': return 'success';
      case 'under_review': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asset Library</h2>
          <p className="text-gray-600 mt-1">Manage all your digital assets in one place</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/dam/assets/upload')}>
          <Upload className="w-4 h-4" />
          Upload Assets
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{totalAssets}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedAssets}</p>
              </div>
              <FileText className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingAssets}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search assets by name or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AssetType | 'all')}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'image', label: 'Images' },
                { value: 'video', label: 'Videos' },
                { value: 'audio', label: 'Audio' },
                { value: 'document', label: 'Documents' },
                { value: 'other', label: 'Other' },
              ]}
              className="w-48"
            />

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssetStatus | 'all')}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'approved', label: 'Approved' },
                { value: 'under_review', label: 'Under Review' },
                { value: 'draft', label: 'Draft' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'archived', label: 'Archived' },
              ]}
              className="w-48"
            />

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => {
            const Icon = getAssetIcon(asset.type);
            return (
              <Card 
                key={asset.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dam/assets/${asset.id}`)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  {asset.thumbnailUrl ? (
                    <Image 
                      src={asset.thumbnailUrl} 
                      alt={asset.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <Badge 
                    variant={getStatusVariant(asset.status)}
                    className="absolute top-2 right-2"
                  >
                    {asset.status}
                  </Badge>
                </div>

                <CardContent>
                  <h3 className="font-medium text-gray-900 truncate mb-1">
                    {asset.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="uppercase">{asset.format}</span>
                    <span>•</span>
                    <span>{formatFileSize(asset.size)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {asset.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="info" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {asset.tags.length > 2 && (
                      <Badge variant="info" className="text-xs">
                        +{asset.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" className="flex-1">
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="space-y-4">
              {filteredAssets.map((asset) => {
                const Icon = getAssetIcon(asset.type);
                return (
                  <div 
                    key={asset.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => router.push(`/dam/assets/${asset.id}`)}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {asset.thumbnailUrl ? (
                        <Image 
                          src={asset.thumbnailUrl} 
                          alt={asset.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded"
                          unoptimized
                        />
                      ) : (
                        <Icon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {asset.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="uppercase">{asset.format}</span>
                        <span>•</span>
                        <span>{formatFileSize(asset.size)}</span>
                        <span>•</span>
                        <span>{asset.uploadedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {asset.tags.map(tag => (
                          <Badge key={tag} variant="info" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(asset.status)}>
                        {asset.status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No results */}
      {filteredAssets.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

