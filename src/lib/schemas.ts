import { z } from "zod";

export const BUYER_TYPES = [
  "Wholesaler / Distributor",
  "Retailer",
  "Food Processor / Manufacturer",
  "Hotel, Restaurant or Caterer",
  "Overseas Importer / Exporter",
  "Other",
] as const;

export const QUANTITY_UNITS = ["kg", "Quintal", "Metric Tonne", "Container"] as const;

/** Optional free-text field that also accepts an empty string from the form. */
const optionalText = z.string().trim().max(160).optional().or(z.literal(""));

/**
 * Single source of truth for the enquiry payload. Shared by the contact form,
 * the quote drawer, the API route, and whatever backend is wired up later.
 */
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "That name looks too long"),
  company: optionalText,
  email: z.email("Enter a valid email address"),
  phone: optionalText,
  buyerType: z.enum(BUYER_TYPES, "Select the option that fits you best"),
  product: optionalText,
  quantity: optionalText,
  unit: z.enum(QUANTITY_UNITS).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters")
    .max(2000, "Please keep this under 2000 characters"),
  /** Honeypot: real users never fill this. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const enquiryDefaults: EnquiryInput = {
  name: "",
  company: "",
  email: "",
  phone: "",
  buyerType: "Wholesaler / Distributor",
  product: "",
  quantity: "",
  unit: "",
  message: "",
  website: "",
};
