import type { Metadata } from "next";
import { getCustomersForUser } from "./actions";
import { CustomersList } from "./customers-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Customers",
};

export default async function CustomersPage() {
    const { customers, error } = await getCustomersForUser();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Customers</h1>
                <p className="text-muted-foreground mt-1">
                    Manage and view all your customers.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Something went wrong loading customers. Please try again.
                </div>
            )}

            <CustomersList initialCustomers={customers} />
        </div>
    );
}
