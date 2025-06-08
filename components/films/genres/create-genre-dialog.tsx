"use client"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { createGenre } from "@/lib/api/genres"
import { Textarea } from "@/components/ui/textarea"

export function CreateGenreDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      await createGenre(token, {
        name: form.name,
        description: form.description,
      })
      setOpen(false)
      setForm({ name: "", description: "" })      
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          New +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Genre</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            required
            placeholder="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}            
          />                
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={submitting || !form.name }>
              {submitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
