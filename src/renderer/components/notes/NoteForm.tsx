import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { Note } from '../../backend/types';
import { Button } from '../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';

const schema = yup.object({
  description: yup.string().required('Please enter a note'),
}).required();

export type NoteFormSchema = yup.InferType<typeof schema>


function NoteForm({
  note,
  loading,
  submit,
}: {
  note?: Note
  loading?: boolean
  submit: (description: string) => Promise<boolean>
}) {
  const form = useForm<NoteFormSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: note?.description || '',
    }
  })

  const onSubmit: SubmitHandler<NoteFormSchema> = async (data) => {
    if (await submit(data.description)) {
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormControl>
                  <Input placeholder="Type your note here..." {...field} />
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
            {note ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default NoteForm

