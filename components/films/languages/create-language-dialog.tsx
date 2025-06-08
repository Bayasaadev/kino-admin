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
import { createLanguage } from "@/lib/api/languages"

export function CreateLanguageDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    code: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      await createLanguage(token, {
        name: form.name,
        code: form.code,
      })
      setOpen(false)
      setForm({ name: "", code: "" })      
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
          <DialogTitle>Create Language</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            required
            placeholder="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <Input
            required
            placeholder="Code"
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
          />                    
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={submitting || !form.name || !form.code}>
              {submitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
