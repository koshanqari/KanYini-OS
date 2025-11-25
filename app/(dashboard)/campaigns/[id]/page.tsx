'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { Edit, Share2, Download, DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { mockCampaigns, mockDonations, mockDonors } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = mockCampaigns.find((c) => c.id === params.id);

  if (!campaign) {
    notFound();
  }

  const campaignDonations = mockDonations.filter((d) => d.campaignId === campaign.id);
  const progress = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100);
  const daysLeft = Math.ceil(
    (new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isActive = daysLeft > 0;
  const avgDonation = campaign.raisedAmount / campaign.donorCount;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton href="/campaigns" />
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
            <Badge variant={isActive ? 'success' : 'default'}>
              {isActive ? 'Active' : 'Completed'}
            </Badge>
          </div>
          <p className="text-gray-600">
            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            {isActive && ` · ${daysLeft} days remaining`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href={`/campaigns/${campaign.id}/edit`}>
            <Button variant="primary" size="sm">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {formatCurrency(campaign.raisedAmount)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  raised of {formatCurrency(campaign.goalAmount)} goal
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">{progress}%</div>
                <div className="text-sm text-gray-500 mt-1">of goal</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  progress >= 80
                    ? 'bg-green-600'
                    : progress >= 50
                    ? 'bg-blue-600'
                    : 'bg-yellow-600'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Donors</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{campaign.donorCount}</div>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Average Gift</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(avgDonation)}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Donations</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {campaignDonations.length}
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Days Left</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {isActive ? daysLeft : 0}
              </div>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaignDonations.slice(0, 5).map((donation) => {
                const donor = mockDonors.find((d) => d.id === donation.donorId);
                return (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {donor?.name.charAt(0).toUpperCase() || 'D'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {donor?.name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(donation.date)}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      {formatCurrency(donation.amount)}
                    </div>
                  </div>
                );
              })}
              {campaignDonations.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No donations yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Donation Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-1">
              {campaignDonations.length > 0 ? (
                campaignDonations.slice(0, 10).map((donation, idx) => {
                  const maxAmount = Math.max(...campaignDonations.map((d) => d.amount));
                  const height = (donation.amount / maxAmount) * 100;
                  return (
                    <div key={donation.id} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-green-600 rounded-t hover:bg-green-700 transition cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`${formatCurrency(donation.amount)} on ${formatDate(
                          donation.date
                        )}`}
                      ></div>
                      <span className="text-xs text-gray-600">
                        {new Date(donation.date).getDate()}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p className="text-gray-500 text-sm">No donation data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Campaign Type</div>
              <div className="text-base font-medium text-gray-900">
                {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <Badge variant={isActive ? 'success' : 'default'}>
                {isActive ? 'Active' : 'Completed'}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Start Date</div>
              <div className="text-base font-medium text-gray-900">
                {formatDate(campaign.startDate)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">End Date</div>
              <div className="text-base font-medium text-gray-900">
                {formatDate(campaign.endDate)}
              </div>
            </div>
            {campaign.projectId && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Associated Project</div>
                <Link
                  href={`/projects/${campaign.projectId}`}
                  className="text-base font-medium text-kanyini-primary hover:text-green-700"
                >
                  View Project →
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

