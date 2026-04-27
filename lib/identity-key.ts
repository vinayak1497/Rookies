/**
 * Generate a unique identity key for a customer.
 * Format: lower(name + "_" + phone)
 * Example: "disha_9087654322"
 *
 * This is the ONLY unique identifier for customers.
 * Multiple customers can share a phone if they have different names.
 */
export function generateIdentityKey(
    name: string | null | undefined,
    phone: string | null | undefined
): string {
    const safeName = (name ?? "unknown").trim().toLowerCase().replace(/\s+/g, "_");
    const safePhone = (phone ?? "no_phone").trim();
    return `${safeName}_${safePhone}`;
}
