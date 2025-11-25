'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { BackButton } from '@/components/ui/BackButton';
import { Plus, Trash2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface POC {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export default function AddDonorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    type: 'individual',
    tier: 'regular',
    email: '',
    phone: '',
    address: '',
    tags: '',
    notes: '',
    // Individual fields
    preferredContact: 'email',
    // Organization fields
    organizationName: '',
    companySize: '',
    industry: '',
    website: '',
  });

  const [pointsOfContact, setPointsOfContact] = useState<POC[]>([
    { id: '1', name: '', designation: '', email: '', phone: '', isPrimary: true },
  ]);

  const isOrganization = ['corporate', 'foundation', 'government'].includes(formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const donorData = {
      ...formData,
      pointsOfContact: isOrganization ? pointsOfContact : undefined,
    };

    console.log('Saving donor:', donorData);

    setLoading(false);
    router.push('/donors');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addPOC = () => {
    setPointsOfContact([
      ...pointsOfContact,
      {
        id: Date.now().toString(),
        name: '',
        designation: '',
        email: '',
        phone: '',
        isPrimary: false,
      },
    ]);
  };

  const removePOC = (id: string) => {
    if (pointsOfContact.length > 1) {
      setPointsOfContact(pointsOfContact.filter((poc) => poc.id !== id));
    }
  };

  const updatePOC = (id: string, field: keyof POC, value: string | boolean) => {
    setPointsOfContact(
      pointsOfContact.map((poc) =>
        poc.id === id ? { ...poc, [field]: value } : poc
      )
    );
  };

  const setPrimaryPOC = (id: string) => {
    setPointsOfContact(
      pointsOfContact.map((poc) => ({
        ...poc,
        isPrimary: poc.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton href="/donors" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Donor</h2>
          <p className="text-gray-600 mt-1">Create a new donor profile</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donor Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Donor Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={[
                    { value: 'individual', label: 'Individual' },
                    { value: 'corporate', label: 'Corporate / Company' },
                    { value: 'foundation', label: 'Foundation / Trust' },
                    { value: 'government', label: 'Government / Public Sector' },
                  ]}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {isOrganization
                    ? 'Organization donors can have multiple points of contact'
                    : 'Individual donor with personal contact information'}
                </p>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isOrganization ? (
                    <>
                      <Input
                        label="Organization Name"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder="Enter organization name"
                        required
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          placeholder="e.g., Technology, Manufacturing"
                        />
                        <Input
                          label="Company Size"
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleChange}
                          placeholder="e.g., 100-500 employees"
                        />
                      </div>
                      <Input
                        label="Website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://www.example.com"
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        required
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          required
                        />
                        <Input
                          label="Phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <Select
                        label="Preferred Contact Method"
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleChange}
                        options={[
                          { value: 'email', label: 'Email' },
                          { value: 'phone', label: 'Phone' },
                          { value: 'mail', label: 'Mail' },
                        ]}
                      />
                    </>
                  )}

                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address with city and state"
                  />

                  <Select
                    label="Donor Tier"
                    name="tier"
                    value={formData.tier}
                    onChange={handleChange}
                    options={[
                      { value: 'major', label: 'Major' },
                      { value: 'regular', label: 'Regular' },
                      { value: 'recurring', label: 'Recurring' },
                      { value: 'one-time', label: 'One-time' },
                    ]}
                    required
                  />

                  <Input
                    label="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Separate tags with commas (e.g., Recurring, Corporate Match)"
                    helperText="Use tags to categorize and filter donors"
                  />

                  <Textarea
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes about this donor..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Points of Contact (Only for Organizations) */}
            {isOrganization && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Points of Contact</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Add key contacts within the organization
                      </p>
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={addPOC}>
                      <Plus className="w-4 h-4" />
                      Add POC
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pointsOfContact.map((poc, index) => (
                      <div
                        key={poc.id}
                        className="p-4 border rounded-lg space-y-4 relative"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                              Contact {index + 1}
                            </span>
                            {poc.isPrimary && (
                              <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3" />
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!poc.isPrimary && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setPrimaryPOC(poc.id)}
                              >
                                <Star className="w-4 h-4" />
                                Set as Primary
                              </Button>
                            )}
                            {pointsOfContact.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePOC(poc.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Name"
                            value={poc.name}
                            onChange={(e) => updatePOC(poc.id, 'name', e.target.value)}
                            placeholder="Contact person name"
                            required
                          />
                          <Input
                            label="Designation"
                            value={poc.designation}
                            onChange={(e) => updatePOC(poc.id, 'designation', e.target.value)}
                            placeholder="e.g., CSR Head, Manager"
                            required
                          />
                          <Input
                            label="Email"
                            type="email"
                            value={poc.email}
                            onChange={(e) => updatePOC(poc.id, 'email', e.target.value)}
                            placeholder="contact@example.com"
                            required
                          />
                          <Input
                            label="Phone"
                            type="tel"
                            value={poc.phone}
                            onChange={(e) => updatePOC(poc.id, 'phone', e.target.value)}
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  {isOrganization ? (
                    <>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="font-medium text-blue-900 mb-1">Organization Donors</div>
                        <ul className="text-xs space-y-1 text-blue-800">
                          <li>• Add multiple points of contact</li>
                          <li>• Mark one as primary contact</li>
                          <li>• Include designation/role</li>
                          <li>• CSR contacts are important</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="font-medium text-green-900 mb-1">Best Practices</div>
                        <ul className="text-xs space-y-1 text-green-800">
                          <li>• Get decision-maker contact</li>
                          <li>• Add finance team contact</li>
                          <li>• Note reporting requirements</li>
                          <li>• Track renewal dates</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="font-medium text-blue-900 mb-1">Donor Tiers</div>
                        <ul className="text-xs space-y-1 text-blue-800">
                          <li>• <strong>Major:</strong> High-value donors (₹100K+)</li>
                          <li>• <strong>Regular:</strong> Consistent supporters</li>
                          <li>• <strong>Recurring:</strong> Monthly/annual</li>
                          <li>• <strong>One-time:</strong> Single contribution</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="font-medium text-green-900 mb-1">Best Practices</div>
                        <ul className="text-xs space-y-1 text-green-800">
                          <li>• Verify email addresses</li>
                          <li>• Add tags for easy filtering</li>
                          <li>• Document preferences</li>
                          <li>• Update tier based on giving</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link href="/donors">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" loading={loading}>
            Create Donor
          </Button>
        </div>
      </form>
    </div>
  );
}
