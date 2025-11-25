'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { BackButton } from '@/components/ui/BackButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockProjects } from '@/data/mockData';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    goalAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    type: 'general',
    projectId: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Creating campaign:', formData);

    setLoading(false);
    router.push('/campaigns');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton href="/campaigns" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
          <p className="text-gray-600 mt-1">Set up a new fundraising campaign</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Campaign Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Plant 10,000 Trees - 2025"
                    required
                  />

                  <Textarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the purpose and goals of this campaign..."
                    rows={4}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Campaign Type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      options={[
                        { value: 'general', label: 'General Fund' },
                        { value: 'project', label: 'Project-Specific' },
                        { value: 'emergency', label: 'Emergency Relief' },
                      ]}
                      required
                    />
                    <Select
                      label="Associate with Project (Optional)"
                      name="projectId"
                      value={formData.projectId}
                      onChange={handleChange}
                      options={[
                        { value: '', label: 'No Project' },
                        ...mockProjects.map((p) => ({
                          value: p.id,
                          label: p.name,
                        })),
                      ]}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Fundraising Goal & Timeline
                    </h4>
                    <div className="space-y-4">
                      <Input
                        label="Goal Amount (₹)"
                        name="goalAmount"
                        type="number"
                        value={formData.goalAmount}
                        onChange={handleChange}
                        placeholder="1000000"
                        required
                        helperText="Target amount to raise for this campaign"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Start Date"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          label="End Date"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Campaign Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="font-medium text-blue-900 mb-1">Set Realistic Goals</div>
                    <p className="text-xs text-blue-800">
                      Base your goal on similar past campaigns and available donor base.
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="font-medium text-green-900 mb-1">Timeline Matters</div>
                    <p className="text-xs text-green-800">
                      Campaigns typically run 30-90 days. Shorter campaigns create urgency.
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="font-medium text-yellow-900 mb-1">Tell a Story</div>
                    <p className="text-xs text-yellow-800">
                      Use compelling descriptions and updates to engage donors throughout.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                    <div className="font-medium text-purple-900 mb-1">Campaign Types</div>
                    <ul className="text-xs text-purple-800 space-y-1 mt-2">
                      <li>• <strong>General:</strong> Unrestricted funds</li>
                      <li>• <strong>Project:</strong> Specific initiative</li>
                      <li>• <strong>Emergency:</strong> Urgent response</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link href="/campaigns">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" loading={loading}>
            Create Campaign
          </Button>
        </div>
      </form>
    </div>
  );
}

