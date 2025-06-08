import { DeleteCountryButton } from "@/components/films/countries/delete-country-button";
import { EditCountryDialog } from "@/components/films/countries/edit-country-dialog";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type Country = {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export function getCountryColumns(onSuccess: () => void): ColumnDef<Country>[] {
  return [
    {
      accessorKey: "flag",
      header: "Flag",
      cell: ({ row }) => {
        const country = row.original;
        return (
          <Image
            src={country.flag}
            alt="Flag preview"
            width={64}
            height={64}
            className="w-16 h-10 object-cover"
            style={{ width: "2rem", height: "2rem" }}
          />
        );
      },
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
          <EditCountryDialog country={row.original} onSuccess={onSuccess} />
          <DeleteCountryButton country={row.original} onSuccess={onSuccess} />
        </div>
      ),
      size: 120,
    },
  ];
}