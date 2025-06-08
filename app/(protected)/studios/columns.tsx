import { DeleteStudioButton } from "@/components/films/studios/delete-studio-button";
import { EditStudioDialog } from "@/components/films/studios/edit-studio-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Country } from "../countries/columns";

export type Studio = {
  id: number;
  name: string;
  description: string;
  founded_year: number;
  country: Country;
}

export function getStudioColumns(onSuccess: () => void): ColumnDef<Studio>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "founded_year",
      header: "Founded",
    },
     {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => (
        <span>{row.original?.country.name}</span>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <EditStudioDialog studio={row.original} onSuccess={onSuccess} />
          <DeleteStudioButton studio={row.original} onSuccess={onSuccess} />
        </div>
      ),
      size: 120,
    },
  ];
}