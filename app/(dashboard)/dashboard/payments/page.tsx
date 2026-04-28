"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  IndianRupee, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Calendar,
  History
} from "lucide-react";
import { AddPaymentModal } from "@/components/payments/AddPaymentModal";

interface Payment {
  id: string;
  customer_name: string;
  phone: string | null;
  amount: number;
  status: "pending" | "paid" | "overdue";
  due_date: string | null;
  paid_at: string | null;
  source: string;
  created_at: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments/list");
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const markAsPaid = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch("/api/payments/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const sendReminder = async (payment: Payment) => {
    setActionLoading(`reminder-${payment.id}`);
    try {
      const response = await fetch("/api/payments/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customer_name: payment.customer_name,
          phone: payment.phone,
          amount: payment.amount
        }),
      });
      if (response.ok) {
        alert("Reminder sent successfully!");
      }
    } catch (error) {
      console.error("Failed to send reminder:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pendingPayments = payments.filter(p => p.status === "pending" || p.status === "overdue");
  const recentPayments = payments.filter(p => p.status === "paid").slice(0, 5);
  
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const overdueCount = pendingPayments.filter(p => p.status === "overdue").length;

  const aiSummary = `You have ${formatCurrency(totalPending)} pending from ${pendingPayments.length} customers. ${overdueCount > 0 ? `${overdueCount} payments need attention.` : "Everything looks on track!"}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payments</h1>
          <p className="text-slate-500">Track and manage your money with ease.</p>
        </div>
        <AddPaymentModal onSuccess={fetchPayments} />
      </div>

      {/* AI Summary Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <IndianRupee className="h-16 w-16 text-indigo-600" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-indigo-600 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg md:text-xl font-semibold text-slate-800">
            {aiSummary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Payments Card */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingPayments.length === 0 ? (
              <p className="text-center py-8 text-slate-400">No pending payments.</p>
            ) : (
              pendingPayments.map(payment => (
                <div 
                  key={payment.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    payment.status === "overdue" 
                    ? "bg-amber-50/50 border-amber-100" 
                    : "bg-white border-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">{payment.customer_name}</h3>
                      <p className="text-sm text-slate-500">{payment.phone || "No phone"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(payment.amount)}</p>
                      {payment.due_date && (
                        <p className={`text-xs flex items-center justify-end gap-1 ${
                          payment.status === "overdue" ? "text-amber-600 font-medium" : "text-slate-400"
                        }`}>
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2 text-indigo-600 border-indigo-100 hover:bg-indigo-50"
                      onClick={() => sendReminder(payment)}
                      disabled={!!actionLoading}
                    >
                      {actionLoading === `reminder-${payment.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Reminder
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => markAsPaid(payment.id)}
                      disabled={!!actionLoading}
                    >
                      {actionLoading === payment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Mark Paid
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Payments Card */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-500" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                 <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                 <p>No recent completions.</p>
              </div>
            ) : (
              recentPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-800">{payment.customer_name}</p>
                      <p className="text-[10px] text-slate-400">Paid on {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{formatCurrency(payment.amount)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
