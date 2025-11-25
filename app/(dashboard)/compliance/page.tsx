'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileText, Upload, Download, Search, AlertCircle } from 'lucide-react';
import { mockDocuments } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'legal', 'financial', 'compliance', 'grants', 'reports'];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge variant="success">Valid</Badge>;
      case 'expiring':
        return <Badge variant="warning">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="error">Expired</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance & Documents</h2>
          <p className="text-gray-600 mt-1">Manage legal, financial, and compliance documents</p>
        </div>
        <Button variant="primary">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-600">Total Documents</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{mockDocuments.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Valid</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {mockDocuments.filter(d => d.status === 'valid').length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Expiring Soon</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">
            {mockDocuments.filter(d => d.status === 'expiring').length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Expired</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {mockDocuments.filter(d => d.status === 'expired').length}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-kanyini-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{document.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="capitalize">{document.category}</span>
                      {' · '}
                      Uploaded {formatDate(document.uploadDate)}
                      {document.expiryDate && (
                        <span>
                          {' · '}
                          Expires {formatDate(document.expiryDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(document.status)}
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No documents found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {mockDocuments.some(d => d.status === 'expiring' || d.status === 'expired') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockDocuments
                .filter(d => d.status === 'expiring' || d.status === 'expired')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-600">
                          {doc.status === 'expired' ? 'Expired' : 'Expires soon'} - 
                          {doc.expiryDate && ` ${formatDate(doc.expiryDate)}`}
                        </div>
                      </div>
                    </div>
                    <Button variant="primary" size="sm">
                      Renew
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

