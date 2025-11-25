'use client';

import { useState } from 'react';
import { BackButton } from '@/components/ui/BackButton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { mockPrograms } from '@/data/beneficiaryMockData';
import { Plus, X, Save } from 'lucide-react';
import { Gender, BeneficiaryStatus } from '@/types';

interface FamilyMemberForm {
  name: string;
  relationship: string;
  age: string;
  gender: Gender;
  occupation?: string;
}

export default function AddBeneficiaryPage() {
  const [loading, setLoading] = useState(false);
  const [beneficiaryType, setBeneficiaryType] = useState<'Individual' | 'Organization' | 'Community Group'>('Individual');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Female' as Gender,
    phone: '',
    email: '',
    
    // Organization fields
    organizationType: 'School' as 'School' | 'Hospital' | 'Community Center' | 'Cooperative' | 'Other',
    organizationName: '',
    registrationNumber: '',
    establishedYear: '',
    headOfOrganization: '',
    numberOfMembers: '',
    
    // Address
    street: '',
    village: '',
    district: '',
    state: 'Karnataka',
    pincode: '',
    country: 'India',
    
    // Guardian
    guardianName: '',
    guardianPhone: '',
    
    // Demographics
    education: '',
    occupation: '',
    monthlyIncome: '',
    languages: [] as string[],
    householdSize: '1',
    
    // Program
    programIds: [] as string[],
    caseManager: '',
    status: 'Active' as BeneficiaryStatus,
    
    // Additional
    tags: [] as string[],
    specialNeeds: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMemberForm[]>([]);
  const [newLanguage, setNewLanguage] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Form data:', formData);
    console.log('Family members:', familyMembers);

    alert('Beneficiary added successfully! (Demo mode)');
    setLoading(false);
  };

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        name: '',
        relationship: '',
        age: '',
        gender: 'Female',
        occupation: '',
      },
    ]);
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMemberForm, value: string) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFamilyMembers(updated);
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData({ ...formData, languages: [...formData.languages, newLanguage] });
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l) => l !== language),
    });
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900">Add New Beneficiary</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Beneficiary Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Beneficiary Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={beneficiaryType}
                onChange={(e) => setBeneficiaryType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                required
              >
                <option value="Individual">Individual</option>
                <option value="Organization">Organization (School, Hospital, etc.)</option>
                <option value="Community Group">Community Group (SHG, Cooperative, etc.)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information - Individual */}
        {beneficiaryType === 'Individual' && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Organization Information */}
        {beneficiaryType !== 'Individual' && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Organization Name"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => setFormData({ ...formData, organizationType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                    required
                  >
                    <option value="School">School</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Community Center">Community Center</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Input
                  label="Registration Number"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="Optional"
                />
                <Input
                  label="Established Year"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                  placeholder="e.g., 2005"
                />
                <Input
                  label="Head of Organization"
                  value={formData.headOfOrganization}
                  onChange={(e) => setFormData({ ...formData, headOfOrganization: e.target.value })}
                  placeholder="e.g., Principal, Director"
                  required
                />
                <Input
                  label="Number of Members/Students"
                  type="number"
                  value={formData.numberOfMembers}
                  onChange={(e) => setFormData({ ...formData, numberOfMembers: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="optional"
              />
              <Input
                label="Street Address"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="Optional"
              />
              <Input
                label="Village/Area"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              />
              <Input
                label="District"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
              <Input
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="Optional"
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information - Only for Individuals */}
        {beneficiaryType === 'Individual' && (
          <Card>
            <CardHeader>
              <CardTitle>Guardian/Primary Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Guardian Name"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="Optional"
                />
                <Input
                  label="Guardian Phone"
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demographics - Only for Individuals */}
        {beneficiaryType === 'Individual' && (
          <Card>
          <CardHeader>
            <CardTitle>Demographics & Background</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Education Level"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="e.g., Primary, Secondary, Graduate"
              />
              <Input
                label="Occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g., Farmer, Student, Homemaker"
              />
              <Input
                label="Monthly Income Range"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                placeholder="e.g., ₹5,000 - ₹10,000"
              />
              <Input
                label="Household Size"
                type="number"
                value={formData.householdSize}
                onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                required
                min="1"
              />
            </div>

            {/* Languages */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  placeholder="Add language"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                />
                <Button type="button" variant="secondary" onClick={addLanguage}>
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((language) => (
                  <span
                    key={language}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Family Members - Only for Individuals */}
        {beneficiaryType === 'Individual' && (
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Family Members</CardTitle>
              <Button type="button" variant="secondary" size="sm" onClick={addFamilyMember}>
                <Plus className="w-4 h-4" />
                Add Family Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {familyMembers.length > 0 ? (
              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Family Member {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFamilyMember(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Name"
                        value={member.name}
                        onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                        required
                      />
                      <Input
                        label="Relationship"
                        value={member.relationship}
                        onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                        placeholder="e.g., Spouse, Child, Parent"
                        required
                      />
                      <Input
                        label="Age"
                        type="number"
                        value={member.age}
                        onChange={(e) => updateFamilyMember(index, 'age', e.target.value)}
                        required
                        min="0"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          value={member.gender}
                          onChange={(e) => updateFamilyMember(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <Input
                        label="Occupation"
                        value={member.occupation}
                        onChange={(e) => updateFamilyMember(index, 'occupation', e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No family members added yet</p>
            )}
          </CardContent>
        </Card>
        )}

        {/* Program Enrollment */}
        <Card>
          <CardHeader>
            <CardTitle>Program Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enroll in Programs (Optional)
                </label>
                <select
                  multiple
                  value={formData.programIds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      programIds: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary h-40"
                >
                  {mockPrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
              <Input
                label="Assign Case Manager"
                value={formData.caseManager}
                onChange={(e) => setFormData({ ...formData, caseManager: e.target.value })}
                required
                placeholder="e.g., Priya Sharma"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as BeneficiaryStatus })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                label="Special Needs or Medical Conditions"
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                placeholder="Optional"
                rows={3}
              />

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                  />
                  <Button type="button" variant="secondary" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContactName: e.target.value })
                    }
                  />
                  <Input
                    label="Relationship"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContactRelationship: e.target.value })
                    }
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContactPhone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save className="w-4 h-4" />
            Save Beneficiary
          </Button>
        </div>
      </form>
    </div>
  );
}

