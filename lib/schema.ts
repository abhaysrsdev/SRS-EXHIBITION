import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be under 100 characters'),

  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),

  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City must be under 100 characters'),

  state: z.string().max(100).optional().or(z.literal('')),

  shop_name: z
    .string()
    .min(2, 'Shop / Boutique name is required')
    .max(200, 'Name must be under 200 characters'),

  business_type: z
    .enum(['Wholesaler', 'Retailer', 'Distributor', 'Other'])
    .optional()
    .or(z.literal('')),

  product_code: z.string().max(100).optional().or(z.literal('')),

  sales_order_code: z.string().max(100).optional().or(z.literal('')),

  remarks: z.string().max(500, 'Remarks must be under 500 characters').optional().or(z.literal('')),
});

export type LeadFormSchema = z.infer<typeof leadFormSchema>;
