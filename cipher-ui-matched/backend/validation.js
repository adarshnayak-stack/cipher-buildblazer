import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().default('WORKSHOP'),
  status: z.enum(['upcoming','ongoing','completed']).default('upcoming'),
  date: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  shortDescription: z.string().default(''),
  fullDescription: z.string().default(''),
  image: z.string().default(''),
  galleryImages: z.array(z.string()).default([]),
  registrationLink: z.string().default('')
});

export const memberSchema = z.object({
  id: z.string().min(1),
  group: z.enum(['faculty','officeBearers','coreTeam']).default('coreTeam'),
  name: z.string().min(1),
  role: z.string().optional().default(''),
  designation: z.string().optional().default(''),
  department: z.string().optional().default(''),
  year: z.string().optional().default(''),
  image: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  github: z.string().optional().default(''),
  bio: z.string().optional().default('')
});

export const joinSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  usn: z.string().regex(/^[A-Za-z0-9]{6,15}$/),
  year: z.string().min(1),
  department: z.string().min(1),
  message: z.string().min(1).max(3000)
});

export function parsed(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const err = new Error(result.error.issues.map(x => `${x.path.join('.')}: ${x.message}`).join('; '));
    err.status = 400; throw err;
  }
  return result.data;
}
