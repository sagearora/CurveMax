import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { Note } from '../../backend/types';
import { Button } from '../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Dropdown } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import dayjs from 'dayjs';

const schema = yup.object({
  description: yup.string().required('Please enter a note'),
  followup: yup.string().required(),
}).required();

export type NoteFormSchema = yup.InferType<typeof schema>

const FollowupOptions: {
  [id: string]: {
    label: string
    days?: number
    months?: number
  }
} = {
  '0': {
    label: 'No Reminder',
    days: 0,
  },
  '1': {
    label: '1 Day',
    days: 1,
  },
  '2': {
    label: '3 Days',
    days: 3,
  },
  '3': {
    label: '1 week',
    days: 7,
  },
  '4': {
    label: '2 weeks',
    days: 14,
  },
  '5': {
    label: '1 month',
    months: 1,
  },
  '6': {
    label: '3 months',
    months: 3,
  },
  '7': {
    label: '6 months',
    months: 6,
  },
}

function NoteForm({
  note,
  loading,
  submit,
}: {
  note?: Note
  loading?: boolean
  submit: (description: string, due_date?: string) => Promise<boolean>
}) {
  const form = useForm<NoteFormSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: note?.description || '',
      followup: '0',
    }
  })

  const onSubmit: SubmitHandler<NoteFormSchema> = async (data) => {
    const follow_up = data.followup === '0' ? undefined : FollowupOptions[data.followup || '0']
    const due_date = follow_up ? dayjs().add(follow_up.months || 0, 'm').add(follow_up.days || 0, 'd').toISOString() : undefined
    if (await submit(data.description, due_date)) {
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
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Input placeholder="Type your note here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }} />
        <div className='flex justify-between items-center'>
          <FormField
            control={form.control}
            name='followup'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Add Reminder</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a followup reminder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(FollowupOptions).map((option: string) => <SelectItem
                        key={option}
                        value={option}>{FollowupOptions[option].label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }} />
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

