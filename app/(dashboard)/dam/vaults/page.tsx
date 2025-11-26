'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockVaults, mockAssets, mockContent } from '@/data/damMockData';
import { 
  Plus, 
  Search, 
  FolderOpen,
  Globe,
  Lock,
  Users,
  FileText,
  Eye
} from 'lucide-react';

export default function VaultsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private' | 'restricted'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter vaults
  const filteredVaults = mockVaults.filter((vault) => {
    const matchesSearch = vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vault.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility = visibilityFilter === 'all' || vault.visibility === visibilityFilter;

    return matchesSearch && matchesVisibility;
  });

  // Stats
  const stats = {
    total: mockVaults.length,
    public: mockVaults.filter(v => v.visibility === 'public').length,
    private: mockVaults.filter(v => v.visibility === 'private').length,
    restricted: mockVaults.filter(v => v.visibility === 'restricted').length,
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-600" />;
      case 'private':
        return <Lock className="w-4 h-4 text-gray-600" />;
      case 'restricted':
        return <Users className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    const map: Record<string, { variant: 'success' | 'default' | 'warning', label: string }> = {
      public: { variant: 'success', label: 'Public' },
      private: { variant: 'default', label: 'Private' },
      restricted: { variant: 'warning', label: 'Restricted' },
    };
    const v = map[visibility];
    return <Badge variant={v.variant}>{v.label}</Badge>;
  };

  const getVaultCategoryCount = (vaultId: string) => {
    const vault = mockVaults.find(v => v.id === vaultId);
    return vault?.categories.length || 0;
  };

  const getVaultItemCount = (vaultId: string) => {
    const vault = mockVaults.find(v => v.id === vaultId);
    if (!vault) return 0;
    return vault.categories.reduce((acc, cat) => acc + cat.items.length, 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vaults</h1>
          <p className="text-gray-600 mt-1">
            Organize and secure your digital assets and content
          </p>
        </div>
        <Button
          onClick={() => router.push('/dam/vaults/new')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Vault
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vaults</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Public</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.public}</p>
            </div>
            <Globe className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Private</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.private}</p>
            </div>
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Restricted</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.restricted}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search vaults..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value as typeof visibilityFilter)}
            options={[
              { value: 'all', label: 'All Visibility' },
              { value: 'public', label: 'Public' },
              { value: 'private', label: 'Private' },
              { value: 'restricted', label: 'Restricted' },
            ]}
            className="w-48"
          />
        </div>
      </Card>

      {/* Vaults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVaults.map((vault) => (
          <Card 
            key={vault.id}
            className="overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push(`/dam/vaults/${vault.id}`)}
          >
            {/* Vault Cover */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
              {vault.thumbnailUrl && (
                <Image
                  src={vault.thumbnailUrl}
                  alt={vault.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-end mb-2">
                  {getVisibilityBadge(vault.visibility)}
                </div>
              </div>
            </div>

            {/* Vault Info */}
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {vault.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {vault.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <FolderOpen className="w-4 h-4" />
                  <span>{getVaultCategoryCount(vault.id)} categories</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{getVaultItemCount(vault.id)} items</span>
                </div>
              </div>

              {/* Tags */}
              {vault.tags && vault.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {vault.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {vault.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{vault.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  By {vault.createdBy}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dam/vaults/${vault.id}`);
                  }}
                >
                  <Eye className="w-3 h-3" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVaults.length === 0 && (
        <Card className="p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vaults found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try adjusting your search query' : 'Create your first vault to get started'}
          </p>
          <Button onClick={() => router.push('/dam/vaults/new')}>
            <Plus className="w-4 h-4" />
            Create Vault
          </Button>
        </Card>
      )}
    </div>
  );
}
