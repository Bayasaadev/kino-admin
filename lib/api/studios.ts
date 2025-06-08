const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: studios list with pagination, search, ordering, filters
export async function getStudios(
  token: string,
  page = 1,
  search = "",
  ordering = "",
  filters: { founded_year?: number; country?: number } = {}
) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (ordering) params.set("ordering", ordering);
  params.set("page", page.toString());
  if (filters.founded_year) params.set("founded_year", filters.founded_year.toString());
  if (filters.country) params.set("country", filters.country.toString());

  const url = `${baseUrl}/films/studios/?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch studios");
  return res.json();
}

// CREATE
export async function createStudio(
  token: string,
  data: { name: string; description?: string; founded_year?: number; country_id?: number }
) {
  const url = `${baseUrl}/films/studios/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail ||
      errorData?.message ||
      "Failed to create studio"
    );
  }

  return res.json();
}

// UPDATE
export async function updateStudio(
  token: string,
  id: number,
  data: { name?: string; description?: string; founded_year?: number; country_id?: number }
) {
  const url = `${baseUrl}/films/studios/${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail ||
      errorData?.message ||
      "Failed to update studio"
    );
  }

  return res.json();
}

// DELETE
export async function deleteStudio(token: string, id: number) {
  const url = `${baseUrl}/films/studios/${id}/`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail ||
      errorData?.message ||
      "Failed to delete studio"
    );
  }

  return true;
}
