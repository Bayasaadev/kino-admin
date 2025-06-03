// Login
export async function login(username: string, password: string) {
  const res = await fetch("http://localhost:8000/api/auth/admin-login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.non_field_errors?.[0] || data.detail || "Login failed");
  }
  return data;
}

// Fetch Profile
export async function fetchProfile(token: string | null) {
  if (!token) throw new Error("No access token");

  const res = await fetch("http://localhost:8000/api/auth/profile/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    throw new Error("Token expired");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json(); // returns user object
}
