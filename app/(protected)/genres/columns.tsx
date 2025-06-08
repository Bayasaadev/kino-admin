import { DeleteGenreButton } from "@/components/films/genres/delete-genre-button";
import { EditGenreDialog } from "@/components/films/genres/edit-genre-dialog";
import { ColumnDef } from "@tanstack/react-table";

export type Genre = {
  id: number;
  name: string;
  description: string;
}

export function getGenreColumns(onSuccess: () => void): ColumnDef<Genre>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <EditGenreDialog genre={row.original} onSuccess={onSuccess} />
          <DeleteGenreButton genre={row.original} onSuccess={onSuccess} />
        </div>
      ),
      size: 120,
    },
  ];
}