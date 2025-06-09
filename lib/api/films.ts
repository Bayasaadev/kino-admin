const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getFilms(
  token: string,
  page = 1,
  search = "",
  ordering = "",
  filters: {
    year?: number;
    genres?: number[];
    themes?: number[];
    studios?: number[];
    countries?: number[];
    languages?: number[];
  } = {}
) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (ordering) params.set("ordering", ordering);
  params.set("page", page.toString());
  if (filters.year) params.set("year", filters.year.toString());
  if (filters.genres)
    filters.genres.forEach(id => params.append("genres", id.toString()));
  if (filters.themes)
    filters.themes.forEach(id => params.append("themes", id.toString()));
  if (filters.studios)
    filters.studios.forEach(id => params.append("studios", id.toString()));
  if (filters.countries)
    filters.countries.forEach(id => params.append("countries", id.toString()));
  if (filters.languages)
    filters.languages.forEach(id => params.append("languages", id.toString()));

  const url = `${baseUrl}/films/films/?${params.toString()}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch films");
  return res.json();
}

export async function getFilmDetail(token: string, id: number) {
  const url = `${baseUrl}/films/films/${id}/`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch film detail");
  return res.json();
}

export async function createFilm(
  token: string,
  data: {
    title: string;
    original_title?: string;
    tagline?: string;
    year?: number;
    description?: string;
    duration?: number;
    trailer_url?: string;
    release_date?: string;
    poster?: File | null;
    background?: File | null;
  }
) {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.original_title) formData.append("original_title", data.original_title);
  if (data.tagline) formData.append("tagline", data.tagline);
  if (data.year) formData.append("year", data.year.toString());
  if (data.description) formData.append("description", data.description);
  if (data.duration) formData.append("duration", data.duration.toString());
  if (data.trailer_url) formData.append("trailer_url", data.trailer_url);
  if (data.release_date) formData.append("release_date", data.release_date);
  if (data.poster) formData.append("poster", data.poster);
  if (data.background) formData.append("background", data.background);

  const url = `${baseUrl}/films/films/`;
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
      errorData?.detail || errorData?.message || "Failed to create film"
    );
  }
  return res.json();
}

export async function updateFilm(
  token: string,
  id: number,
  data: {
    title?: string;
    original_title?: string;
    tagline?: string;
    year?: number;
    description?: string;
    duration?: number;
    trailer_url?: string;
    release_date?: string;
    genres?: number[];
    themes?: number[];
    studios?: number[];
    countries?: number[];
    languages?: number[];
    poster?: File | null;
    background?: File | null;
  }
) {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.original_title) formData.append("original_title", data.original_title);
  if (data.tagline) formData.append("tagline", data.tagline);
  if (data.year) formData.append("year", data.year.toString());
  if (data.description) formData.append("description", data.description);
  if (data.duration) formData.append("duration", data.duration.toString());
  if (data.trailer_url) formData.append("trailer_url", data.trailer_url);
  if (data.release_date) formData.append("release_date", data.release_date);
  if (data.genres)
    data.genres.forEach(id => formData.append("genres", id.toString()));
  if (data.themes)
    data.themes.forEach(id => formData.append("themes", id.toString()));
  if (data.studios)
    data.studios.forEach(id => formData.append("studios", id.toString()));
  if (data.countries)
    data.countries.forEach(id => formData.append("countries", id.toString()));
  if (data.languages)
    data.languages.forEach(id => formData.append("languages", id.toString()));
  if (data.poster) formData.append("poster", data.poster);
  if (data.background) formData.append("background", data.background);

  const url = `${baseUrl}/films/films/${id}/`;
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
      errorData?.detail || errorData?.message || "Failed to update film"
    );
  }
  return res.json();
}

export async function deleteFilm(token: string, id: number) {
  const url = `${baseUrl}/films/films/${id}/`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail || errorData?.message || "Failed to delete film"
    );
  }
  return true;
}