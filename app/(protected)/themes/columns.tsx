import { DeleteThemeButton } from "@/components/films/themes/delete-theme-button";
import { EditThemeDialog } from "@/components/films/themes/edit-theme-dialog";
import { ColumnDef } from "@tanstack/react-table";

export type Theme = {
  id: number;
  name: string;
  description: string;
}

export function getThemeColumns(onSuccess: () => void): ColumnDef<Theme>[] {
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
          <EditThemeDialog theme={row.original} onSuccess={onSuccess} />
          <DeleteThemeButton theme={row.original} onSuccess={onSuccess} />
        </div>
      ),
      size: 120,
    },
  ];
}