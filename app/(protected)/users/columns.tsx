import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// User type as before
export type User = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  role: string;
}

// Define the callback type for role change
type OnRoleChange = (user: User, newRole: string) => Promise<void>;

// Function returns columns array, takes onRoleChange
export function getUserColumns(onRoleChange: OnRoleChange): ColumnDef<User>[] {
  return [
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
      header: "Username"
    },
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      accessorKey: "role",
      header: "Role",
      // Inline editing cell:
      cell: ({ row }) => {
        const user = row.original;
        const [isLoading, setIsLoading] = useState(false);

        return (
          <Select
            value={user.role}
            disabled={isLoading}
            onValueChange={async (value) => {
              if (value === user.role) return;
              setIsLoading(true);
              try {
                await onRoleChange(user, value);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
  ];
}
