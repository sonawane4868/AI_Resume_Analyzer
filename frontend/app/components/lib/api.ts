let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export async function apiFetch(url: string, options: any = {}) {
  console.log("BASE URL:", process.env.NEXT_PUBLIC_APP_URLfetch);
  let res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  if (res.status !== 401) return res;

  // 🔥 If already refreshing → wait
  if (isRefreshing && refreshPromise) {
    await refreshPromise;
  } else {
    // 🔥 Start refresh
    isRefreshing = true;

    refreshPromise = fetch(`${process.env.NEXT_PUBLIC_APP_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Refresh failed");
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });

    await refreshPromise;
  }

  // 🔁 retry original request
  return fetch(`${process.env.NEXT_PUBLIC_APP_URL}${url}`, {
    ...options,
    credentials: "include",
  });
}