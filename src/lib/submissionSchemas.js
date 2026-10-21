import { z } from 'zod'
const text=max=>z.string().trim().max(max)
const optional=max=>text(max).optional()
const message=text(10000).min(1,'Le message est requis').refine(value=>!/(.)\1{29,}/su.test(value) && (value.match(/https?:\/\//giu)||[]).length<=10,'Veuillez verifier le message')
const common={name:text(150).min(1),email:text(254).email(),phone:optional(50),company:optional(200)}
export const contactSchema=z.object({...common,subject:text(200).min(1),message})
export const quoteRequestSchema=z.object({...common,phone:text(50).min(8),address:optional(500),city:optional(150),type:z.enum(['product','service','mixed']),subject:optional(200),message:message.optional().or(z.literal('')),budget:optional(100),deadline:z.string().datetime().optional(),items:z.array(z.object({type:z.enum(['product','service','custom']),id:optional(100),name:text(200).min(1),description:optional(10000),quantity:z.number().int().positive().max(100000),unitPrice:z.number().positive().max(99999999),totalPrice:z.number().positive().max(99999999)})).min(1).max(100)})
