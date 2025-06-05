const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers(token: string, page = 1, search = "", role = "", ordering = "") {  
  const params = new URLSearchParams();  
  if (search) params.set("search", search);
  if (role) params.set("role", role);
  if (ordering) params.set("ordering", ordering);
  params.set("page", page.toString());

  const url = `${baseUrl}/auth/private-users/?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function updateUserRole(token: string, userId: number, role: string) {
  const url = `${baseUrl}/auth/users/${userId}/set-role/`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    // Optional: get error detail from response
    let errorDetail = "";
    try {
      const data = await res.json();
      errorDetail = data.detail || res.statusText;
    } catch {
      errorDetail = res.statusText;
    }
    throw new Error(`Failed to update role: ${errorDetail}`);
  }

  return res.json();
}
