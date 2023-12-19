"use client"

import {useForm} from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import{zodResolver} from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import * as z from "zod";

//import { updateUser } from '@/lib/actions/user.actions';
import { CommentValidation } from '@/lib/validations/message';
import Image from 'next/image';
import { addCommentToMessage } from '@/lib/actions/message.actions';
// import { createMessage } from '@/lib/actions/message.actions';

interface Props{
    messageId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({messageId, currentUserImg, currentUserId}: Props) => {
    const router = useRouter();
        const pathname = usePathname();

        const form = useForm({
            resolver: zodResolver(CommentValidation),
            defaultValues: {
                message: '',
            }
        })

        const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
           await addCommentToMessage(messageId, values.message, JSON.parse
            (currentUserId), pathname);

            form.reset();

        
        }


    return(
        <Form {...form}>
        <form 
        className="comment-form"
        onSubmit={form.handleSubmit(onSubmit)}
         >
  
  <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className='flex w-full items-center gap-3'>
                <FormLabel>

                <Image
                src={currentUserImg}
                alt="Profile image"
                width={48}
                height={48}
                className="rounded-full object-cover"

                />

                  
                
                </FormLabel>
                <FormControl className='border-none bg-transparent'>
                  <Input 
                 type='text'
                 {...field}
                 placeholder='Comment...'
                 className='no-focus text-light-1 outline-none'
                  
                  
                  />
                </FormControl>
                
              </FormItem>
            )}
          />
  
          <Button type = "submit" 
          className="comment-form_btn">
              Reply
  
          </Button>
         </form>
         </Form>
    );
    
}
export default Comment;