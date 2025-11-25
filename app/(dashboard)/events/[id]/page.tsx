'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { mockEvents } from '@/data/eventMockData';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  Edit,
  Video,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const event = mockEvents.find((e) => e.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendees' | 'materials'>('overview');

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600">The event you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const attendanceRate = event.maxAttendees
    ? Math.round((event.currentAttendees / event.maxAttendees) * 100)
    : 0;

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      workshop: 'bg-purple-100 text-purple-800',
      meetup: 'bg-blue-100 text-blue-800',
      webinar: 'bg-green-100 text-green-800',
      conference: 'bg-red-100 text-red-800',
      social: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
      Upcoming: 'info',
      Ongoing: 'success',
      Completed: 'default',
      Cancelled: 'error',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={getStatusBadge(event.status)}>{event.status}</Badge>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(event.type)}`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
              {event.isVirtual && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Virtual
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-gray-600 mt-1">{event.projectName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export Attendees
          </Button>
          <Button variant="secondary" size="sm" onClick={() => router.push(`/events/${id}/edit`)}>
            <Edit className="w-4 h-4" />
            Edit Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total RSVPs</div>
            <div className="text-2xl font-bold text-gray-900">{event.currentAttendees}</div>
            {event.maxAttendees && (
              <div className="text-xs text-gray-500 mt-1">of {event.maxAttendees} capacity</div>
            )}
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Attendance Rate</div>
            <div className="text-2xl font-bold text-kanyini-primary">{attendanceRate}%</div>
            {event.maxAttendees && (
              <div className="text-xs text-gray-500 mt-1">
                {event.maxAttendees - event.currentAttendees} spots remaining
              </div>
            )}
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Event Date</div>
            <div className="text-lg font-bold text-gray-900">{formatDate(event.date)}</div>
            <div className="text-xs text-gray-500 mt-1">{event.startTime} - {event.endTime}</div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Organizer</div>
            <div className="text-lg font-bold text-gray-900">{event.organizer}</div>
            {event.organizerEmail && (
              <div className="text-xs text-gray-500 mt-1">{event.organizerEmail}</div>
            )}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {(['overview', 'attendees', 'materials'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === tab
                  ? 'border-kanyini-primary text-kanyini-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Event Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.agenda.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Prerequisites */}
            {event.prerequisites && (
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{event.prerequisites}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(event.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Time</div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="text-sm font-medium text-gray-900">{event.location}</div>
                    </div>
                  </div>
                  {event.isVirtual && event.virtualLink && (
                    <div className="pt-3 border-t">
                      <Button variant="primary" size="sm" className="w-full">
                        <Video className="w-4 h-4" />
                        Join Virtual Event
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-gray-900">{event.organizer}</div>
                  </div>
                  {event.organizerEmail && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${event.organizerEmail}`} className="hover:text-kanyini-primary">
                        {event.organizerEmail}
                      </a>
                    </div>
                  )}
                  {event.organizerPhone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${event.organizerPhone}`} className="hover:text-kanyini-primary">
                        {event.organizerPhone}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Capacity */}
            {event.maxAttendees && (
              <Card>
                <CardHeader>
                  <CardTitle>Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Registration Progress</span>
                    <span className="text-sm font-bold text-kanyini-primary">{attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-kanyini-primary h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {event.currentAttendees} / {event.maxAttendees} registered
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Attendees Tab */}
      {activeTab === 'attendees' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Registered Attendees ({event.currentAttendees})</CardTitle>
              <Button variant="secondary" size="sm">
                <Send className="w-4 h-4" />
                Send Update
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {event.attendees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RSVP Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attended
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {event.attendees.map((attendee) => (
                      <tr key={attendee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{attendee.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{attendee.phone || '—'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{formatDate(attendee.rsvpDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={attendee.attended || false}
                            className="w-4 h-4 text-kanyini-primary border-gray-300 rounded focus:ring-kanyini-primary"
                            onChange={() => {
                              // TODO: Implement attendance tracking
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendees Yet</h3>
                <p className="text-gray-600">Attendees will appear here once they RSVP</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <Card>
          <CardHeader>
            <CardTitle>Event Materials & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            {event.materials && event.materials.length > 0 ? (
              <div className="space-y-3">
                {event.materials.map((material, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{material}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Available</h3>
                <p className="text-gray-600">Event materials will be uploaded here</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

