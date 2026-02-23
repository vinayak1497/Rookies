// ─── Rookies TypeScript Types ───
// These mirror the Prisma schema for use in components and API routes.

export type UserRole = "owner" | "admin" | "staff" | "viewer";

export type BusinessType = "home_baker" | "kirana" | "instagram_brand" | "other";

export type OrderStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export type OrderSource = "whatsapp" | "instagram" | "walk_in" | "phone";

export type PaymentMethod = "upi" | "cash" | "bank_transfer" | "card";

export type PaymentStatus = "pending" | "received" | "failed";

// ─── Business ───

export interface Business {
    id: string;
    name: string;
    slug: string;
    type: BusinessType | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    gstNumber: string | null;
    logoUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ─── Business Member ───

export interface BusinessMember {
    id: string;
    businessId: string;
    userId: string;
    role: UserRole;
    isActive: boolean;
    joinedAt: string;
}

// ─── Order ───

export interface Order {
    id: string;
    businessId: string;
    customerId: string | null;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    notes: string | null;
    source: OrderSource | null;
    deliveryDate: string | null;
    createdAt: string;
    updatedAt: string;
}

// ─── Customer ───

export interface Customer {
    id: string;
    businessId: string;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

// ─── Payment ───

export interface Payment {
    id: string;
    businessId: string;
    orderId: string | null;
    amount: number;
    method: PaymentMethod | null;
    status: PaymentStatus;
    transactionId: string | null;
    notes: string | null;
    paidAt: string | null;
    createdAt: string;
}

// ─── Inventory Item ───

export interface InventoryItem {
    id: string;
    businessId: string;
    name: string;
    sku: string | null;
    quantity: number;
    unit: string | null;
    costPrice: number | null;
    sellPrice: number | null;
    lowStockAt: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ─── Activity Log ───

export interface ActivityLog {
    id: string;
    businessId: string;
    userId: string | null;
    action: string;
    entity: string | null;
    entityId: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
}

// ─── API Response ───

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
