"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
  id: number
  username: string
  email: string
  avatar: string
  role: string
}

const roles = ["all", "admin", "staff", "user"]

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Only redirect if user is loaded and NOT admin
    if (user && user.role !== "admin") {
      router.replace("/")
    }

    setLoading(true)
    let url = `http://localhost:8000/api/auth/users/?page=${page}`
    if (search) url += `&search=${search}`
    if (role !== "all") url += `&role=${role}`

    const token = localStorage.getItem("access")
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.results || [])
        setCount(data.count || 0)
        setTotalPages(Math.ceil((data.count || 1) / 10)) // adjust page size if needed
      })
      .finally(() => setLoading(false))
  }, [user, router, search, role, page])

  if (!user) {
    // Still loading user info
    return <div>Loading...</div>
  }

  if (user.role !== "admin") {
    // Optional: brief message (should redirect almost immediately)
    return <div>Access denied</div>
  }

  // Admin sees the page content
  return (
    <div className="p-4">
      
      {/* Section cards */}
      <p>Total users: {count} </p>
      <p>This month: {count} </p>
      <p>This year: {count} </p>

      {/* Users table */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Avatar</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="rounded-lg">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">{user.role}</TableCell>
              </TableRow>
            ))}            
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
