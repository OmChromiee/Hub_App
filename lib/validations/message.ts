import * as z from 'zod';

export const MessageValidation = z.object({
    message: z.string().nonempty().min(3, { message:
    'Minimum 3 characters'}).max(2000, {
        message: 'Maximum 2000 characters'}),
        accountId: z.string(),
    })

export const CommentValidation = z.object({
    message: z.string().nonempty().min(3, {message:
        'Minimum 3 characters'}).max(500, {
            message: 'Maximum 500 characters'}),

    })

    
