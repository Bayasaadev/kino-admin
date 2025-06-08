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
import { useRef, useState } from "react"
import { createCountry } from "@/lib/api/countries"
import Image from "next/image"

export function CreateCountryDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    code: "",
    flag: null as File | null,
  })
  const [preview, setPreview] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      await createCountry(token, {
        name: form.name,
        code: form.code,
        flag: form.flag,
      })
      setOpen(false)
      setForm({ name: "", code: "", flag: null })
      setPreview("")
      if (onSuccess) onSuccess()
      else window.location.reload()
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
          <DialogTitle>Create Country</DialogTitle>
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
            {form.flag ? "Change Flag" : "Upload Flag"}
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
            <Button type="submit" disabled={submitting || !form.name || !form.code}>
              {submitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
