export const getMe = async () => {
  const res = await fetch("http://localhost:5000/api/me", {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load current user");
  }

  return data;
};

export const logout = async () => {
  const res = await fetch("http://localhost:5000/api/logout", {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to log out");
  }

  return data;
};