const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getThemes(token: string, page = 1, search = "", ordering = "") {  
  const params = new URLSearchParams();  
  if (search) params.set("search", search);
  if (ordering) params.set("ordering", ordering);
  params.set("page", page.toString());

  const url = `${baseUrl}/films/themes/?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch themes");
  return res.json();
}

export async function createTheme(
  token: string,
  data: { name: string; description?: string }
) {
  const url = `${baseUrl}/films/themes/`;
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
      "Failed to create theme"
    );
  }

  return res.json();
}

export async function updateTheme(
  token: string,
  id: number,
  data: { name?: string; description?: string }
) {
  const url = `${baseUrl}/films/themes/${id}/`;
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
      "Failed to update theme"
    );
  }

  return res.json();
}

export async function deleteTheme(token: string, id: number) {
  const url = `${baseUrl}/films/themes/${id}/`;
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
      "Failed to delete theme"
    );
  }

  return true;
}

