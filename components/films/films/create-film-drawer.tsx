"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { createFilm } from "@/lib/api/films"
import Image from "next/image"

export function CreateFilmDrawer({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    original_title: "",
    tagline: "",    
    year: "",
    description: "",
    duration: "",
    trailer_url: "",
    poster: null as File | null,
    background: null as File | null,
  })
  const [poster, setPoster] = useState("")
  const [background, setBackground] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const posterInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem("access")!;
      await createFilm(token, {
        title: form.title,
        original_title: form.original_title,
        tagline: form.tagline,
        year: form.year ? Number(form.year) : undefined,
        description: form.description,
        duration: form.duration ? Number(form.duration) : undefined,
        trailer_url: form.trailer_url,
        poster: form.poster,
        background: form.background,
      })
      setOpen(false)
      setForm({ 
        title: "",
        original_title: "",
        tagline: "",    
        year: "",
        description: "",
        duration: "",
        trailer_url: "",
        poster: null,
        background: null
      })
      setPoster("")
      setBackground("")
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          New +
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <ScrollArea className="overflow-auto">
          <DrawerHeader>
            <DrawerTitle>Create Film</DrawerTitle>          
          </DrawerHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 px-4">
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files?.[0] || null
                setForm(f => ({ ...f, background: file }))
                if (file) setBackground(URL.createObjectURL(file))
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => backgroundInputRef.current?.click()}
            >
              {form.background ? "Change Background" : "Upload Background"}
            </Button>
            {background && (
              <div className="w-full">
                <Image
                  src={background}
                  alt="Background preview"
                  width={1600}
                  height={900}
                  className="w-full object-cover rounded-md"
                  style={{ aspectRatio: "16/9" }}
                />
              </div>
            )}
            <Input
              required
              placeholder="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <Input            
              placeholder="Original title"
              value={form.original_title}
              onChange={e => setForm(f => ({ ...f, original_title: e.target.value }))}
            />
            <Input            
              placeholder="Tagline"
              value={form.tagline}
              onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
            />
            <Input
              required
              type="number"
              placeholder="Year"
              value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
              min={1800}
              max={3000}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}            
            />             
            <Input
              required
              type="number"
              placeholder="Duration"
              value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              min={0}
              max={1000}
            />
            <Input            
              placeholder="Trailer"
              value={form.trailer_url}
              onChange={e => setForm(f => ({ ...f, trailer_url: e.target.value }))}
            />
            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files?.[0] || null
                setForm(f => ({ ...f, poster: file }))
                if (file) setPoster(URL.createObjectURL(file))
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => posterInputRef.current?.click()}
            >
              {form.poster ? "Change Poster" : "Upload Poster"}
            </Button>
            {poster && (
              <div className="flex justify-center items-center">
                <div className="w-1/2">
                  <Image
                    src={poster}
                    alt="Poster preview"
                    width={200}
                    height={300}
                    className="rounded-md"
                    style={{ aspectRatio: "2/3" }}
                  />
                </div>
              </div>
            )}
            {error && <div className="text-red-500">{error}</div>}        
            <DrawerFooter>
              <Button type="submit" disabled={submitting || !form.title }>
                {submitting ? "Creating..." : "Create"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
