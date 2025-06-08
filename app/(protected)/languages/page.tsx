"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { useEffect, useState } from "react"
import { getLanguages } from "@/lib/api/languages"
import { DataTable } from "@/components/ui/data-table"
import { getLanguageColumns, Language } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateLanguageDialog } from "@/components/films/languages/create-language-dialog"

const PAGE_SIZE = 20

export default function LanguagesPage() {  
  const { user } = useAuth()
  // Search, Filter, Order, Paginate
  const [languages, setLanguages] = useState<Language[]>([])
  const [count, setCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [ordering, setOrdering] = useState<string>("-id");
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLanguages = () => {
    const token = localStorage.getItem("access")
    if (!token || !user) return
    setLoading(true)
    setError(null)
    getLanguages(token, pageIndex + 1, search, ordering)
      .then(data => {
        setLanguages(data.results || [])
        setCount(data.count)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }  

  const columns = getLanguageColumns(fetchLanguages)

  useEffect(() => {
    fetchLanguages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pageIndex, search, ordering])

  if (!user) {
    return <div>Checking authentication...</div>
  }

  if (loading) {
    return <div>Loading languages...</div>
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }  

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 max-w-xs">
            <form
              onSubmit={e => {
                e.preventDefault();
                setPageIndex(0);
                setSearch(searchInput);
              }}
              className="flex gap-2 max-w-xs"
            >
              <Input
                className="w-[240px]"
                placeholder="Search..."
                value={searchInput}
                onChange={e => {              
                  setSearchInput(e.target.value)
                }}
              />
              <Button type="submit">Search</Button>
            </form>            
          </div>  
          <div className="flex gap-2">
            <Select
              value={ordering}
              onValueChange={value => {
                setOrdering(value);
                setPageIndex(0);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-id">Newest</SelectItem>
                <SelectItem value="id">Earliest</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="-name">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            <CreateLanguageDialog onSuccess={fetchLanguages} />   
          </div>
        </div>                  
        <DataTable
          columns={columns}
          data={languages}
          pageCount={Math.ceil(count / PAGE_SIZE)}
          pageIndex={pageIndex}
          onPageChange={setPageIndex}
          isLoading={loading}
          totalCount={count}
        />        
      </div>      
    </div>
  )
}
