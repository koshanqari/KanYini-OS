'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, TrendingUp, Users, Calendar, Target } from 'lucide-react';
import { mockCampaigns } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function CampaignsPage() {
  const activeCampaigns = mockCampaigns.filter(
    (c) => new Date(c.endDate) > new Date()
  );
  const completedCampaigns = mockCampaigns.filter(
    (c) => new Date(c.endDate) <= new Date()
  );

  const totalGoal = mockCampaigns.reduce((sum, c) => sum + c.goalAmount, 0);
  const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalDonors = mockCampaigns.reduce((sum, c) => sum + c.donorCount, 0);

  const getCampaignProgress = (campaign: typeof mockCampaigns[0]) => {
    return Math.round((campaign.raisedAmount / campaign.goalAmount) * 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 25) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getCampaignTypeColor = (type: string) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      project: 'bg-blue-100 text-blue-800',
      emergency: 'bg-red-100 text-red-800',
    };
    return colors[type as keyof typeof colors] || colors.general;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fundraising Campaigns</h2>
          <p className="text-gray-600 mt-1">Track and manage fundraising campaigns</p>
        </div>
        <Link href="/campaigns/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-600">Total Goal</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(totalGoal)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Total Raised</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {formatCurrency(totalRaised)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Overall Progress</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {Math.round((totalRaised / totalGoal) * 100)}%
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Total Donors</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{totalDonors}</div>
        </Card>
      </div>

      {/* Active Campaigns */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Active Campaigns ({activeCampaigns.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeCampaigns.map((campaign) => {
            const progress = getCampaignProgress(campaign);
            const daysLeft = Math.ceil(
              (new Date(campaign.endDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <Card key={campaign.id} hover>
                <Link href={`/campaigns/${campaign.id}`}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {campaign.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getCampaignTypeColor(
                              campaign.type
                            )}`}
                          >
                            {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {daysLeft} days left
                          </span>
                        </div>
                      </div>
                      <Badge variant={progress >= 80 ? 'success' : 'warning'}>
                        {progress}%
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(campaign.raisedAmount)}
                        </span>
                        <span className="text-gray-500">
                          of {formatCurrency(campaign.goalAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${getProgressColor(
                            progress
                          )}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">
                          {campaign.donorCount}
                        </div>
                        <div className="text-xs text-gray-500">Donors</div>
                      </div>
                      <div className="text-center">
                        <Target className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(campaign.raisedAmount / campaign.donorCount)}
                        </div>
                        <div className="text-xs text-gray-500">Avg. Gift</div>
                      </div>
                      <div className="text-center">
                        <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">
                          {formatDate(campaign.endDate)}
                        </div>
                        <div className="text-xs text-gray-500">End Date</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completed Campaigns */}
      {completedCampaigns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Completed Campaigns ({completedCampaigns.length})
          </h3>
          <div className="space-y-3">
            {completedCampaigns.map((campaign) => {
              const progress = getCampaignProgress(campaign);
              return (
                <Card key={campaign.id} hover>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-semibold text-gray-900">
                            {campaign.name}
                          </h4>
                          <Badge variant={progress >= 100 ? 'success' : 'warning'}>
                            {progress >= 100 ? 'Goal Reached' : `${progress}%`}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Ended {formatDate(campaign.endDate)} · {campaign.donorCount} donors
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(campaign.raisedAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          of {formatCurrency(campaign.goalAmount)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

