'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { mockAdminConversations } from '@/data/adminMessageMockData';
import {
  Send,
  Paperclip,
  User,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { MessageStatus } from '@/types';

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const conversation = mockAdminConversations.find(c => c.id === params.id);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(conversation?.status || 'open');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!conversation) {
    return (
      <div className="space-y-6">
        <BackButton href="/messages" label="Back to Messages" />
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Conversation not found</h3>
            <p className="text-gray-600 mb-4">The conversation you are looking for does not exist.</p>
            <Button onClick={() => router.push('/messages')}>
              Back to Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', message);
    alert('Message sent! (This is a prototype)');
    setMessage('');
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as MessageStatus);
    alert(`Status changed to: ${newStatus} (This is a prototype)`);
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

  return (
    <div className="space-y-6">
      <BackButton href="/messages" label="Back to Messages" />

      {/* Conversation Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {conversation.userProfilePicture ? (
                <Image
                  src={conversation.userProfilePicture}
                  alt={conversation.userName}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 text-white flex items-center justify-center text-2xl font-bold">
                  {conversation.userName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{conversation.userName}</h1>
                <p className="text-gray-600">{conversation.userEmail}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusVariant(conversation.status)} className="capitalize">
                    {conversation.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="default" className="capitalize">
                    {conversation.category}
                  </Badge>
                  <Badge variant="info" className="capitalize">
                    {conversation.priority}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={[
                  { value: 'open', label: 'Open' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'closed', label: 'Closed' },
                ]}
                className="w-48"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6 max-h-[600px] overflow-y-auto">
                {conversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${msg.senderRole === 'admin' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-lg p-4 ${
                          msg.senderRole === 'admin'
                            ? 'bg-kanyini-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">{msg.senderName}</p>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.attachments.map((attachment, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <Paperclip className="w-3 h-3" />
                                <span>{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-2 ${msg.senderRole === 'admin' ? 'text-green-100' : 'text-gray-500'}`}>
                          {msg.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t pt-4">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="mb-3"
                />
                <div className="flex items-center justify-between">
                  <Button variant="secondary" size="sm">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach File
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Details */}
        <div className="space-y-6">
          {/* Subject */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{conversation.subject}</p>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="text-gray-900">{conversation.createdAt.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="text-gray-900">{conversation.updatedAt.toLocaleString()}</p>
                </div>
              </div>
              {conversation.resolvedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-gray-600">Resolved</p>
                    <p className="text-gray-900">{conversation.resolvedAt.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {conversation.assignedTo && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Assigned To</p>
                    <p className="text-gray-900">{conversation.assignedTo}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {conversation.tags && conversation.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {conversation.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center gap-1"
                    >
                      {tag}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" />
                    </span>
                  ))}
                </div>
                <Button variant="secondary" size="sm" className="w-full mt-3">
                  <Tag className="w-4 h-4 mr-2" />
                  Add Tag
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push(`/kc-users/${conversation.userId}`)}
              >
                <User className="w-4 h-4 mr-2" />
                View User Profile
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => alert('Assign conversation (This is a prototype)')}
              >
                <User className="w-4 h-4 mr-2" />
                Assign to Me
              </Button>
              <Button
                variant="danger"
                className="w-full"
                onClick={() => {
                  if (confirm('Are you sure you want to close this conversation?')) {
                    handleStatusChange('closed');
                  }
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Close Conversation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

