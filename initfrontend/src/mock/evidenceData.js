export const evidenceData = {
  'EV-00042': {
    id: 'EV-00042',
    filename: 'financial_transaction.pdf',
    uploadedAt: '2023-01-10T09:15:00Z',
    description: 'PDF of a suspicious financial transaction.',
    uploader: 'alice@example.com',
    hash: 'a1b2c3d4e5f6g7h8i9j0',
  },
  'EV-00043': {
    id: 'EV-00043',
    filename: 'bank_statement.pdf',
    uploadedAt: '2023-01-11T08:20:00Z',
    description: 'Bank statement PDF for account review.',
    uploader: 'alice@example.com',
    hash: 'b1c2d3e4f5g6h7i8j9k0',
  },
  'EV-00044': {
    id: 'EV-00044',
    filename: 'email_evidence.eml',
    uploadedAt: '2023-01-09T07:45:00Z',
    description: 'Email evidence imported as EML.',
    uploader: 'alice@example.com',
    hash: 'c1d2e3f4g5h6i7j8k9l0',
  },
};

export function getEvidenceById(evidenceId) {
  return evidenceData[evidenceId] || null;
}
