"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUsers } from "@/lib/api/users"
import { DataTable } from "@/components/ui/data-table"
import { columns, User } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 20

export default function UsersPage() {  
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [count, setCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [filterInput, setFilterInput] = useState("")
  const [filter, setFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    if (user.role !== "admin") {
      router.replace("/")
      return
    }

    const token = localStorage.getItem("access")
    if (!token) {
      setError("Not authenticated")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    getUsers(token, pageIndex + 1, filter)
      .then(data => {
        setUsers(data.results || [])
        setCount(data.count)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user, router, pageIndex, filter])

  if (!user) {
    return <div>Checking authentication...</div>
  }

  if (loading) {
    return <div>Loading users...</div>
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex gap-2 max-w-xs mb-4">
          <Input
            placeholder="Username filter"
            value={filterInput}
            onChange={e => {              
              setFilterInput(e.target.value)
            }}
          />
          <Button
            onClick={() => {
              setPageIndex(0)
              setFilter(filterInput)
            }}
          >
            Search
          </Button>
        </div>        
        <DataTable
            columns={columns}
            data={users}
            pageCount={Math.ceil(count / PAGE_SIZE)}
            pageIndex={pageIndex}
            onPageChange={setPageIndex}
            isLoading={loading}
          />
      </div>      
    </div>
  )
}
