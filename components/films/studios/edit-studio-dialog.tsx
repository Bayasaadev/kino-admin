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

import { updateStudio } from "@/lib/api/studios"
import { getCountries } from "@/lib/api/countries"

type Country = {
  id: number;
  name: string;
  code: string;
  flag: string;
};

type Studio = {
  id: number;
  name: string;
  description: string;
  founded_year?: number | null;
  country?: Country | null;
};

export function EditStudioDialog({ 
  studio,
  onSuccess,
}: { 
  studio: Studio
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: studio.name || "",
    description: studio.description || "",
    founded_year: studio.founded_year?.toString() || "",
    country_id: studio.country?.id ? String(studio.country.id) : "none",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    if (open) {
      getCountries("")
        .then((data) => setCountries(data.results ?? data))
        .catch(() => setCountries([]));
    }
  }, [open]);

  // Update form if studio prop changes
  useEffect(() => {
    if (open) {
      setForm({
        name: studio.name || "",
        description: studio.description || "",
        founded_year: studio.founded_year?.toString() || "",
        country_id: studio.country?.id ? String(studio.country.id) : "none",
      });
    }
  }, [open, studio]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      await updateStudio(token, studio.id, {
        name: form.name,
        description: form.description,
        founded_year: form.founded_year ? Number(form.founded_year) : undefined,
        country_id: form.country_id && form.country_id !== "none" ? Number(form.country_id) : undefined,
      });
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
          <DialogTitle>Edit Studio</DialogTitle>
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
          <Input
            type="number"
            placeholder="Founded year"
            value={form.founded_year}
            onChange={(e) =>
              setForm((f) => ({ ...f, founded_year: e.target.value }))
            }
            min={1800}
            max={3000}
          />
          <Select
            value={form.country_id}
            onValueChange={(value) =>
              setForm((f) => ({ ...f, country_id: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Country (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

