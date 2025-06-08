import { DeleteLanguageButton } from "@/components/films/languages/delete-language-button";
import { EditLanguageDialog } from "@/components/films/languages/edit-language-dialog";
import { ColumnDef } from "@tanstack/react-table";

export type Language = {
  id: number;
  name: string;
  code: string;
}

export function getLanguageColumns(onSuccess: () => void): ColumnDef<Language>[] {
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
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <EditLanguageDialog language={row.original} onSuccess={onSuccess} />
          <DeleteLanguageButton language={row.original} onSuccess={onSuccess} />
        </div>
      ),
      size: 120,
    },
  ];
}