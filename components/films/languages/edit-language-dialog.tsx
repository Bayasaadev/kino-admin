"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { updateLanguage } from "@/lib/api/languages"

export function EditLanguageDialog({ 
  language,
  onSuccess,
}: { 
  language: { id: number, name: string, code: string } 
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: language.name, code: language.code || "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      await updateLanguage(token, language.id, form)
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
          <DialogTitle>Edit Language</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
          <Input
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Name"
          />
          <Input
            required
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
            placeholder="Code"
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
