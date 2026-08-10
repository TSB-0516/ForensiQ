import { z } from "zod";

export const EVIDENCE_TYPES = [
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
  "ZIP",
  "GPS_DATA",
  "OTHER",
];

export const evidenceRegistrationSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(1, "Description is required"),
  evidenceType: z.enum(EVIDENCE_TYPES, {
    errorMap: () => ({ message: "Select an evidence type" }),
  }),
  collectionDate: z.string().min(1, "Collection date is required"),
  collectionTime: z.string().min(1, "Collection time is required"),
  collectedBy: z.string().min(1, "Collected by is required"),
  collectionLocation: z.string().min(1, "Collection location is required"),
  relatedSuspect: z.string().optional(),
  relatedWitness: z.string().optional(),
  investigationTags: z.string().optional(),
  additionalRemarks: z.string().optional(),
});