const TIMELINE_CASE_TITLE = 'jewellery robbery';
const TIMELINE_CASE_STORAGE_KEY = 'ueiip_timeline_case_ids';

export const timelineData = [
  {
    id: 'JR-001', date: '2026-09-28', timestamp: '09:15 AM', type: 'CASE REPORTED',
    title: 'Jewellery Robbery Reported',
    description: 'A jewellery robbery was reported at Royal Jewellers. The incident is believed to have occurred between 9:20 PM and 9:45 PM.',
    actor: 'Duty Officer', location: 'Royal Jewellers, RS Puram, Coimbatore',
  },
  {
    id: 'JR-002', date: '2026-09-28', timestamp: '10:05 AM', type: 'OBSERVATION',
    title: 'Rear Entrance Shows No Visible Forced Entry',
    description: 'Crime scene photographs show no visible damage or forced-entry marks on the rear entrance.',
    actor: 'Det. Sarah Chen', location: 'Royal Jewellers, rear entrance',
    implication: 'Observation suggests that the person who entered the premises may have had legitimate access.',
    inference: 'Possible authorized access to the premises.',
  },
  {
    id: 'JR-003', date: '2026-09-28', timestamp: '10:30 AM', type: 'INVESTIGATIVE ACTION',
    title: 'Employee Access Records Requested',
    description: 'Based on the absence of forced entry, investigators reviewed employee access records for the rear entrance.',
    actor: 'Det. Sarah Chen', triggeredBy: 'Rear entrance showed no visible forced entry.',
  },
  {
    id: 'JR-004', date: '2026-09-28', timestamp: '11:20 AM', type: 'EVIDENCE',
    title: 'Employee Access Record Identifies Entry',
    description: 'Access records show that Employee X accessed the rear entrance at approximately 9:32 PM.',
    actor: 'Det. Sarah Chen', evidence: 'Rear Entrance Access Log',
  },
  {
    id: 'JR-005', date: '2026-09-28', timestamp: '11:45 AM', type: 'INFERENCE',
    title: 'Employee X Identified as Person of Interest',
    description: 'The access record places Employee X at the relevant entrance during the estimated time of the robbery.',
    actor: 'Det. Sarah Chen', inference: 'Employee X becomes a person of interest.',
    nextAction: "Verify the employee's whereabouts during the incident.",
  },
  {
    id: 'JR-006', date: '2026-09-28', timestamp: '01:10 PM', type: 'WITNESS INTERVIEW',
    title: 'Security Guard Interviewed',
    description: 'The security guard reported seeing an individual near the rear entrance shortly before a vehicle departed the premises.',
    actor: 'Det. Miguel Alvarez', witnessStatement: 'Individual was observed near the rear entrance around 9:35 PM.',
  },
  {
    id: 'JR-007', date: '2026-09-28', timestamp: '02:00 PM', type: 'INVESTIGATIVE FINDING',
    title: 'Employee X Provides Alibi',
    description: 'Employee X stated that they were at a nearby restaurant during the relevant time period.',
    actor: 'Det. Sarah Chen', claimedLocation: 'Restaurant approximately 1.5 km from the jewellery store.',
  },
  {
    id: 'JR-008', date: '2026-09-28', timestamp: '04:15 PM', type: 'EVIDENCE VERIFICATION',
    title: "Initial Suspect's Alibi Verified",
    description: "Restaurant CCTV and transaction records were reviewed to verify Employee X's statement.",
    actor: 'Det. Sarah Chen', evidence: 'Restaurant CCTV and transaction records',
    result: 'Employee X was confirmed to be at the restaurant during the relevant time period.',
    resultBadge: 'ALIBI CORROBORATED',
    previousInference: 'Employee X was a person of interest.',
    finding: 'Alibi independently corroborated.',
    decision: 'Employee X deprioritized as the primary suspect.',
  },
  {
    id: 'JR-009', date: '2026-09-28', timestamp: '05:00 PM', type: 'NEW LEAD',
    title: 'Vehicle Description Identified',
    description: "The security guard's statement indicates that a vehicle left the rear entrance shortly after the suspected time of the robbery.",
    actor: 'Det. Miguel Alvarez', lead: 'Dark-colored sedan',
    implication: 'Investigators review nearby street CCTV to identify the vehicle.',
  },
  {
    id: 'JR-010', date: '2026-09-29', timestamp: '09:30 AM', type: 'EVIDENCE',
    title: 'Nearby Street CCTV Obtained',
    description: 'CCTV footage from a neighbouring building was obtained and reviewed.',
    actor: 'Forensic Analyst Priya Nair', evidence: 'Street CCTV Footage - Camera 04',
    finding: 'A dark-colored sedan matching the witness description was observed near the jewellery store at approximately 9:41 PM.',
  },
  {
    id: 'JR-011', date: '2026-09-29', timestamp: '11:30 AM', type: 'CORROBORATION',
    title: 'Witness Statement Corroborated by CCTV',
    description: 'The vehicle observed in the CCTV footage is consistent with the vehicle description provided by the witness.',
    actor: 'Det. Miguel Alvarez',
    relationship: ['Witness statement', 'Street CCTV', 'Corroborated vehicle lead'],
  },
  {
    id: 'JR-012', date: '2026-09-29', timestamp: '01:00 PM', type: 'INVESTIGATIVE ACTION',
    title: 'Vehicle Registration Traced',
    description: 'Investigators used the visible vehicle registration details to identify the registered owner.',
    actor: 'Det. Sarah Chen', result: 'New person of interest identified for further investigation.',
  },
];

function normalizeTitle(title) {
  return title?.trim().toLowerCase() ?? '';
}

function readAssociations() {
  try {
    return JSON.parse(localStorage.getItem(TIMELINE_CASE_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function associateTimelineWithCase(caseData) {
  if (normalizeTitle(caseData?.title) !== TIMELINE_CASE_TITLE || caseData?.id == null) return;

  const associations = readAssociations();
  associations[String(caseData.id)] = TIMELINE_CASE_TITLE;
  localStorage.setItem(TIMELINE_CASE_STORAGE_KEY, JSON.stringify(associations));
}

export function getTimelineEvents(caseId, caseTitle) {
  if (normalizeTitle(caseTitle) !== TIMELINE_CASE_TITLE) return [];

  const associatedTitle = readAssociations()[String(caseId)];
  if (associatedTitle && associatedTitle !== TIMELINE_CASE_TITLE) return [];

  return timelineData.map((event) => ({ ...event, caseId }));
}