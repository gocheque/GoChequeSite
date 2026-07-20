const GUEST_ID_KEY = "echeck_guest_id";

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function getGuestId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_ID_KEY);
}
