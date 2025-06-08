const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getCountries(token: string, page = 1, search = "", ordering = "") {  
  const params = new URLSearchParams();  
  if (search) params.set("search", search);
  if (ordering) params.set("ordering", ordering);
  params.set("page", page.toString());

  const url = `${baseUrl}/films/countries/?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export async function createCountry(
  token: string,
  data: { name: string; code: string; flag?: File | null }
) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("code", data.code);
  if (data.flag) formData.append("flag", data.flag);

  const url = `${baseUrl}/films/countries/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail ||
      errorData?.message ||
      "Failed to create country"
    );
  }

  return res.json();
}

export async function updateCountry(
  token: string,
  id: number,
  data: { name?: string; code?: string; flag?: File | null }
) {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.code) formData.append("code", data.code);
  if (data.flag) formData.append("flag", data.flag);

  const url = `${baseUrl}/films/countries/${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail ||
      errorData?.message ||
      "Failed to update country"
    );
  }

  return res.json();
}

export async function deleteCountry(token: string, id: number) {
  const url = `${baseUrl}/films/countries/${id}/`;
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
      "Failed to delete country"
    );
  }

  return true;
}

