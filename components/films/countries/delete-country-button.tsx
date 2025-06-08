"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { deleteCountry } from "@/lib/api/countries"

export function DeleteCountryButton({ 
  country,
  onSuccess, 
}: { 
  country: { id: number, name: string } 
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("access")!
      await deleteCountry(token, country.id)
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
        <Button size="sm" variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Country</DialogTitle>
        </DialogHeader>
        <div>Are you sure you want to delete <b>{country.name}</b>?</div>
        {error && <div className="text-red-500">{error}</div>}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
