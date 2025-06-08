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
import { useState, useRef } from "react"
import { updateCountry } from "@/lib/api/countries"
import Image from "next/image"

export function EditCountryDialog({
  country,
  onSuccess,
}: {
  country: { id: number; name: string; code: string; flag?: string }
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: country.name,
    code: country.code,
    flag: null as File | null, // for new upload
  })
  const [preview, setPreview] = useState(country.flag || "")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null) 
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      // Only send fields that changed, but flag is always optional
      await updateCountry(token, country.id, {
        name: form.name,
        code: form.code,
        flag: form.flag,
      })
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
          <DialogTitle>Edit Country</DialogTitle>
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
          {/* Flag upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => {
              const file = e.target.files?.[0] || null
              setForm(f => ({ ...f, flag: file }))
              if (file) setPreview(URL.createObjectURL(file))
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            {form.flag ? "Change Flag" : preview ? "Replace Flag" : "Upload Flag"}
          </Button>
          {preview && (
            <Image
              src={preview}
              alt="Flag preview"
              width={64}
              height={64}
              className="w-16 h-10 object-cover"
              style={{ width: "4rem", height: "4rem" }}
            />
          )}
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
