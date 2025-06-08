const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getGenres(token: string, page = 1, search = "", ordering = "") {  
  const params = new URLSearchParams();  
  if (search) params.set("search", search);
  if (ordering) params.set("ordering", ordering);
  params.set("page", page.toString());

  const url = `${baseUrl}/films/genres/?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

export async function createGenre(
  token: string,
  data: { name: string; description?: string }
) {
  const url = `${baseUrl}/films/genres/`;
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
      "Failed to create genre"
    );
  }

  return res.json();
}

export async function updateGenre(
  token: string,
  id: number,
  data: { name?: string; description?: string }
) {
  const url = `${baseUrl}/films/genres/${id}/`;
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
      "Failed to update genre"
    );
  }

  return res.json();
}

export async function deleteGenre(token: string, id: number) {
  const url = `${baseUrl}/films/genres/${id}/`;
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
      "Failed to delete genre"
    );
  }

  return true;
}

