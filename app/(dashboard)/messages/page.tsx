'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockAdminConversations } from '@/data/adminMessageMockData';
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  User
} from 'lucide-react';
import { MessageStatus, MessageCategory } from '@/types';

export default function MessagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<MessageCategory | 'all'>('all');

  // Stats
  const totalConversations = mockAdminConversations.length;
  const openConversations = mockAdminConversations.filter(c => c.status === 'open').length;
  const inProgressConversations = mockAdminConversations.filter(c => c.status === 'in_progress').length;
  const resolvedConversations = mockAdminConversations.filter(c => c.status === 'resolved').length;
  const totalUnread = mockAdminConversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Filtered conversations
  const filteredConversations = mockAdminConversations.filter(conv => {
    const matchesSearch = 
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || conv.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: MessageStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-gray-600 mt-1">User queries and support conversations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalConversations}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold text-yellow-600">{openConversations}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressConversations}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedConversations}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{totalUnread}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by user, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MessageStatus | 'all')}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' },
              ]}
              className="w-48"
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as MessageCategory | 'all')}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'technical', label: 'Technical' },
                { value: 'account', label: 'Account' },
                { value: 'payment', label: 'Payment' },
                { value: 'content', label: 'Content' },
                { value: 'report', label: 'Report' },
                { value: 'general', label: 'General' },
                { value: 'feedback', label: 'Feedback' },
              ]}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card>
        <CardContent>
          <div className="space-y-3">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => router.push(`/messages/${conversation.id}`)}
                className={`p-4 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${
                  conversation.unreadCount > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {conversation.userProfilePicture ? (
                      <Image
                        src={conversation.userProfilePicture}
                        alt={conversation.userName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold">
                        {conversation.userName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{conversation.userName}</h3>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="error" className="text-xs">
                            {conversation.unreadCount} new
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTimestamp(conversation.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{conversation.userEmail}</p>
                    <p className="text-sm font-medium text-gray-900 mb-2">{conversation.subject}</p>
                    <p className="text-sm text-gray-600 truncate mb-3">{conversation.lastMessagePreview}</p>
                    
                    {/* Tags and Metadata */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getStatusVariant(conversation.status)} className="capitalize flex items-center gap-1">
                        {getStatusIcon(conversation.status)}
                        {conversation.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getPriorityVariant(conversation.priority)} className="capitalize">
                        {conversation.priority}
                      </Badge>
                      <Badge variant="default" className="capitalize">
                        {conversation.category}
                      </Badge>
                      {conversation.assignedTo && (
                        <Badge variant="info" className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {conversation.assignedTo}
                        </Badge>
                      )}
                      {conversation.tags && conversation.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

