import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

const schema = yup.object({
  content: yup.string().required('Please enter a message'),
}).required();

export type MessageFormSchema = yup.InferType<typeof schema>


function MessageForm({
  loading,
  submit,
}: {
  loading?: boolean
  submit: (content: string) => Promise<boolean>
}) {
  const form = useForm<MessageFormSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      content: '',
    }
  })

  const onSubmit: SubmitHandler<MessageFormSchema> = async (data) => {
    if (await submit(data.content)) {
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormControl>
                  <Input placeholder="Type your message here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }} />
        <div className='text-right'>
          <Button
            disabled={loading}
            type='submit'>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Message
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default MessageForm

