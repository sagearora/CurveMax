import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from '../ui/command'
import { searchCurve } from '../../backend/calls'
import { useRootContext } from '../../lib/RootContextProvider'
import { SearchItem } from '../../backend/types'
import { CommandItem } from 'cmdk'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
    const { base_url } = useRootContext()
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = useState('')
    const [options, setOptions] = useState<SearchItem[]>([])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const result = await searchCurve({
                    base_url,
                    query: search,
                })
                setOptions(result?.items || [])
            } catch (e) {
            }
        })();
    }, [search, base_url])

    const select = (option: SearchItem) => {
        setOpen(false)
        navigate(`/p/${option.id}`)
    }

    return (
        <>
            <Button variant='outline' onClick={() => setOpen(true)}>
                Search Contacts
                <kbd className="ml-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-md">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a name or phone to search..." onValueChange={setSearch} />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {options.map(option => (
                        <CommandItem key={option.id} value={option.id} onSelect={() => select(option)} className='hover:bg-slate-200'>
                            <div className='font-semibold'>{option.first_name} {option.last_name}</div>
                            <div>Dob: {option.dob ? dayjs(option.dob).format('MMM DD, YYYY') : 'Not set'}</div>
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandDialog>

        </>
    )
}

export default SearchBar