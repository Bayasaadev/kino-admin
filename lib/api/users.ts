export async function getUsers(token: string, page = 1, search = "") {
  let url = `http://localhost:8000/api/auth/private-users/?page=${page}`;
  if (search) url += `&search=${search}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json(); // { count, results, next, previous }
}
