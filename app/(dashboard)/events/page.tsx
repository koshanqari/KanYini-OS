'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockEvents } from '@/data/eventMockData';
import { mockProjects } from '@/data/projectMockData';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  Video,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function EventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter events
  let filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesProject = filterProject === 'all' || event.projectId === filterProject;
    return matchesSearch && matchesType && matchesStatus && matchesProject;
  });

  // Sort by date (upcoming first)
  filteredEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Calculate stats
  const totalEvents = mockEvents.length;
  const upcomingEvents = mockEvents.filter((e) => e.status === 'Upcoming').length;
  const completedEvents = mockEvents.filter((e) => e.status === 'Completed').length;
  const totalAttendees = mockEvents.reduce((sum, e) => sum + e.currentAttendees, 0);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-1">Manage community events and workshops</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/events/new')}>
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
              </div>
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingEvents}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedEvents}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Attendees</p>
                <p className="text-2xl font-bold text-kanyini-primary">{totalAttendees}</p>
              </div>
              <Users className="w-10 h-10 text-kanyini-primary opacity-50" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                >
                  <option value="all">All Types</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="webinar">Webinar</option>
                  <option value="conference">Conference</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                >
                  <option value="all">All Status</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                >
                  <option value="all">All Projects</option>
                  {mockProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <Card className="lg:col-span-2">
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or create a new event</p>
              <Button variant="primary" onClick={() => router.push('/events/new')}>
                <Plus className="w-4 h-4" />
                Create First Event
              </Button>
            </div>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <div className="p-6">
                {/* Project Header */}
                <div className="mb-4">
                  <Badge variant="info" className="text-xs">
                    {event.projectName}
                  </Badge>
                </div>

                {/* Event Title and Type */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                    <Badge variant={getStatusBadge(event.status)}>{event.status}</Badge>
                  </div>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  {event.isVirtual && (
                    <span className="inline-block ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                      <Video className="w-3 h-3 inline mr-1" />
                      Virtual
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>

                {/* Attendees Progress */}
                {event.maxAttendees && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.currentAttendees} / {event.maxAttendees} attending
                        </span>
                      </div>
                      <span className="text-xs font-medium text-kanyini-primary">
                        {Math.round((event.currentAttendees / event.maxAttendees) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-kanyini-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

