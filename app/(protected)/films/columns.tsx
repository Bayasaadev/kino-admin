import { DeleteFilmButton } from "@/components/films/films/delete-film-button";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

export type Film = {
  id: number;
  title: string;  
  year: number;
  poster: string;
}

export function getFilmColumns(onSuccess: () => void): ColumnDef<Film>[] {
  return [
    {
      accessorKey: "poster",
      header: "Poster",
      cell: ({ row }) => {
        const film = row.original;
        return (
          <Image
            src={film.poster}
            alt="Poster preview"
            width={50}
            height={100}
            className="rounded-md"
            style={{ aspectRatio: "2/3" }}
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">          
          <Link href={`films/${row.original.id}/`}>
            <Button size="sm" variant="secondary">Edit</Button>
          </Link>
          <DeleteFilmButton film={row.original} onSuccess={onSuccess} />
        </div>
      ),
      size: 120,
    },
  ];
}