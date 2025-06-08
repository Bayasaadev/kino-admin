"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { updateTheme } from "@/lib/api/themes"

export function EditThemeDialog({ 
  theme,
  onSuccess,
}: { 
  theme: { id: number, name: string, description: string } 
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: theme.name, description: theme.description || "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      await updateTheme(token, theme.id, form)
      setOpen(false)
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Theme</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
          <Input
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Name"
          />
          <Textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description"
          />
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
