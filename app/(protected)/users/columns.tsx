import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type User = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  role: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Avatar className="h-10 w-10 rounded-lg grayscale">
          <AvatarImage src={user.avatar ?? ""} alt={user.username} />
          <AvatarFallback className="rounded-lg">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
