"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { createStudio } from "@/lib/api/studios"
import { getCountries } from "@/lib/api/countries"
type Country = {
  id: number;
  name: string;
  code: string;
  flag: string;
};

export function CreateStudioDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    founded_year: "",
    country_id: undefined as string | undefined,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    // Fetch countries on dialog open
    if (open) {
      getCountries("")
        .then((data) => setCountries(data.results ?? data))
        .catch(() => setCountries([]));
    }
  }, [open]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      await createStudio(token, {
        name: form.name,
        description: form.description,
        founded_year: form.founded_year ? Number(form.founded_year) : undefined,
        country_id: form.country_id ? Number(form.country_id) : undefined,
      })
      setOpen(false)
      setForm({ name: "", description: "", founded_year: "", country_id: "" });
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
          <DialogTitle>Create Studio</DialogTitle>
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
          <Input
            type="number"
            placeholder="Founded year"
            value={form.founded_year}
            onChange={e => setForm(f => ({ ...f, founded_year: e.target.value }))}
            min={1800}
            max={3000}
          />          
          <Select
            value={form.country_id}
            onValueChange={value => setForm(f => ({ ...f, country_id: value === "none" ? undefined : value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Country (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {countries.map(c => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
