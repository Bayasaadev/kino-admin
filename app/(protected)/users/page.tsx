"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUsers, updateUserRole } from "@/lib/api/users"
import { DataTable } from "@/components/ui/data-table"
import { getUserColumns, User } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const PAGE_SIZE = 20

export default function UsersPage() {  
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [count, setCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<string>("all")
  const [ordering, setOrdering] = useState<string>("-id");
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const handleRoleChange = async (user: User, newRole: string) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      await updateUserRole(token, user.id, newRole);
      setUsers(prev =>
        prev.map(u =>
          u.id === user.id ? { ...u, role: newRole } : u
        )
      );
      toast.success("Role updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access")

    if (!token || !user || user.role !== "admin") {
      router.replace("/")
      return
    }

    setLoading(true)
    setError(null)

    getUsers(token, pageIndex + 1, search, role === "all" ? "" : role, ordering)
      .then(data => {
        setUsers(data.results || [])
        setCount(data.count)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user, router, pageIndex, search, role, ordering])

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 max-w-xs">
            <Input
              className="w-[240px]"
              placeholder="Username filter"
              value={searchInput}
              onChange={e => {              
                setSearchInput(e.target.value)
              }}
            />
            <Button
              onClick={() => {
                setPageIndex(0)
                setSearch(searchInput)
              }}
            >
              Search
            </Button>
          </div>  
          <div className="flex gap-2">
            <Select
              value={role}
              onValueChange={value => {
                setRole(value)
                setPageIndex(0)
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="username">Username (A-Z)</SelectItem>
                <SelectItem value="-username">Username (Z-A)</SelectItem>
                <SelectItem value="role">Role (A-Z)</SelectItem>
                <SelectItem value="-role">Role (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>              
        <DataTable
            columns={getUserColumns(handleRoleChange)}
            data={users}
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
