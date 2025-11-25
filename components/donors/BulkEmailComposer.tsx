'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Paperclip, Send, Sparkles, X } from 'lucide-react';
import { Donor } from '@/types';

interface BulkEmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Donor[];
  onSend?: (emailData: any) => void;
}

const BULK_EMAIL_TEMPLATES = {
  newsletter: {
    name: 'Newsletter',
    subject: 'Kanyini Earth Project - Monthly Update',
    body: `Dear [NAME],

Welcome to this month's Kanyini Earth Project update!

This Month's Highlights:
• 2,450 new trees planted across our conservation zones
• Water conservation projects reached 3 new villages
• Community workshops engaged 450+ participants

Your Impact:
Together with supporters like you, we've made significant progress toward our environmental goals. Every contribution, big or small, creates lasting change.

Stay connected with us on social media for real-time updates and stories from the field.

With gratitude,
Kanyini Earth Project Team`,
  },
  annual_appeal: {
    name: 'Annual Appeal',
    subject: 'Join us in making 2025 our biggest impact year yet',
    body: `Dear [NAME],

As we approach the end of the year, we're reaching out to share an exciting opportunity to amplify your impact.

This year, we accomplished:
✓ 12,000 trees planted
✓ 8 villages with improved water access
✓ 2,500+ community members trained in sustainable practices

With your support, we can do even more in 2025. We're aiming to:
• Double our reforestation efforts
• Expand to 5 new regions
• Launch innovative conservation programs

Will you join us with a year-end gift? Every donation helps us build a more sustainable future.

Donate now: [DONATION_LINK]

Thank you for being part of our mission.

Warm regards,
Kanyini Earth Project Team`,
  },
  event_announcement: {
    name: 'Event Announcement',
    subject: 'You\'re invited to our Annual Celebration',
    body: `Dear [NAME],

We're excited to invite you to our Annual Impact Celebration!

Event Details:
📅 Date: [DATE]
🕐 Time: [TIME]
📍 Location: [LOCATION]

Join us for:
• Impact presentations and success stories
• Meet our field team and beneficiaries
• Networking with fellow supporters
• Live entertainment and refreshments

This is our way of saying thank you for your incredible support. We hope to see you there!

RSVP: [RSVP_LINK]

Looking forward to celebrating with you!

Best regards,
Kanyini Earth Project Team`,
  },
  custom: {
    name: 'Custom',
    subject: '',
    body: '',
  },
};

export function BulkEmailComposer({ isOpen, onClose, recipients, onSend }: BulkEmailComposerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
  });
  const [sending, setSending] = useState(false);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = BULK_EMAIL_TEMPLATES[templateKey as keyof typeof BULK_EMAIL_TEMPLATES];
    
    if (template) {
      setFormData({
        subject: template.subject,
        body: template.body,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Sending bulk email to:', recipients.map(r => r.email));
    console.log('Email data:', formData);
    
    if (onSend) {
      onSend({ ...formData, recipients: recipients.map(r => r.id) });
    }

    setSending(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Bulk Email" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipients Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Recipients: {recipients.length} donors
            </span>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {recipients.slice(0, 10).map((recipient) => (
              <Badge key={recipient.id} variant="secondary">
                {recipient.name}
              </Badge>
            ))}
            {recipients.length > 10 && (
              <Badge variant="secondary">+{recipients.length - 10} more</Badge>
            )}
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Use Template</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(BULK_EMAIL_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTemplateChange(key)}
                className={`px-3 py-2 text-sm rounded-md transition ${
                  selectedTemplate === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-100'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Email Fields */}
        <Input
          label="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Email subject"
          required
        />

        <Textarea
          label="Message"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Type your message..."
          rows={14}
          required
        />

        {/* Template Variables Help */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-xs text-yellow-800">
            <strong>📌 Personalization:</strong> Use [NAME] to personalize each email. 
            Available placeholders: [NAME], [DATE], [TIME], [LOCATION], [DONATION_LINK], [RSVP_LINK]
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
            Attach File
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={sending}>
              <Send className="w-4 h-4" />
              Send to {recipients.length} donors
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

