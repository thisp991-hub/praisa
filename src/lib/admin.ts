export const ADMIN_EMAIL = "praisareviews@gmail.com";
export const SUPPORT_EMAIL = "praisareviews@gmail.com";
export const WHATSAPP_LINK = "https://wa.me/923016007138";

export function isAdmin(email: string | undefined | null): boolean {
  return email === ADMIN_EMAIL;
}
