export const getMe = async () => {
  const res = await fetch("http://localhost:5000/api/me", {
    credentials: "include",
  });

  return await res.json();
};