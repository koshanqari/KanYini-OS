'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Paperclip, Send, FileText, Sparkles } from 'lucide-react';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    email: string;
  };
  onSend?: (emailData: any) => void;
}

const EMAIL_TEMPLATES = {
  thank_you: {
    name: 'Thank You',
    subject: 'Thank you for your generous donation',
    body: `Dear [NAME],

Thank you for your generous donation of [AMOUNT] to Kanyini Earth Project. Your support makes a real difference in our environmental conservation efforts.

Your contribution will directly support:
- Reforestation and tree planting initiatives
- Water conservation projects
- Community development programs

We'll keep you updated on the impact of your donation through regular updates.

With gratitude,
Kanyini Earth Project Team`,
  },
  receipt: {
    name: 'Donation Receipt',
    subject: 'Donation Receipt - [RECEIPT_NUMBER]',
    body: `Dear [NAME],

Thank you for your donation to Kanyini Earth Project.

Donation Details:
- Amount: [AMOUNT]
- Date: [DATE]
- Receipt Number: [RECEIPT_NUMBER]
- Payment Method: [METHOD]

This donation is eligible for tax deduction under Section 80G of the Income Tax Act.

For any queries, please contact us at donations@kanyini.org

Warm regards,
Kanyini Earth Project`,
  },
  impact_update: {
    name: 'Impact Update',
    subject: 'Your Impact: Recent Progress Update',
    body: `Dear [NAME],

We wanted to share some exciting updates about the impact your support has made possible!

Recent Achievements:
- 4,580 trees planted
- 2,290 tonnes CO₂ offset
- 1,250 community members impacted

Your ongoing support continues to drive real environmental change. Thank you for being part of our mission.

We'd love to hear from you! Feel free to reply to this email with any questions.

Best regards,
Kanyini Earth Project Team`,
  },
  event_invitation: {
    name: 'Event Invitation',
    subject: 'You\'re Invited: [EVENT_NAME]',
    body: `Dear [NAME],

We're excited to invite you to our upcoming event:

Event: [EVENT_NAME]
Date: [DATE]
Time: [TIME]
Location: [LOCATION]

As a valued supporter, we'd be honored to have you join us for this special occasion.

Please RSVP by [RSVP_DATE] by replying to this email or calling us at [PHONE].

Looking forward to seeing you!

Warm regards,
Kanyini Earth Project Team`,
  },
  reengagement: {
    name: 'Re-engagement',
    subject: 'We miss you! Updates from Kanyini',
    body: `Dear [NAME],

We noticed it's been a while since we last connected, and we wanted to reach out to share what's been happening at Kanyini Earth Project.

Recent Highlights:
- New reforestation projects launched
- Expanded community programs
- Increased environmental impact

We'd love to reconnect and hear how you've been. Your past support made a real difference, and we'd be thrilled to have you back as part of our mission.

Would you like to schedule a quick call to catch up?

Best wishes,
Kanyini Earth Project Team`,
  },
  custom: {
    name: 'Custom Email',
    subject: '',
    body: '',
  },
};

export function EmailComposer({ isOpen, onClose, recipient, onSend }: EmailComposerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const [formData, setFormData] = useState({
    to: recipient.email,
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });
  const [sending, setSending] = useState(false);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = EMAIL_TEMPLATES[templateKey as keyof typeof EMAIL_TEMPLATES];
    
    if (template) {
      const personalizedBody = template.body.replace(/\[NAME\]/g, recipient.name);
      setFormData({
        ...formData,
        subject: template.subject,
        body: personalizedBody,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Sending email:', formData);
    
    if (onSend) {
      onSend(formData);
    }

    setSending(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Email" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Template Selection */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Use Template</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
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
          label="To"
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          required
          disabled
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="CC"
            value={formData.cc}
            onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
            placeholder="Optional"
          />
          <Input
            label="BCC"
            value={formData.bcc}
            onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
            placeholder="Optional"
          />
        </div>

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
          rows={12}
          required
        />

        {/* Template Variables Help */}
        {selectedTemplate !== 'custom' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600">
              <strong>Available placeholders:</strong> [NAME], [AMOUNT], [DATE], [RECEIPT_NUMBER], 
              [METHOD], [EVENT_NAME], [TIME], [LOCATION], [RSVP_DATE], [PHONE]
            </div>
          </div>
        )}

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
              Send Email
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

