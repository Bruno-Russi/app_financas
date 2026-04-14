import { createClient } from "@/lib/supabase/client";
import type { Transaction, TransactionFormData } from "@/lib/types";

function getSupabase() {
  return createClient();
}

export async function getTransactions(filters?: {
  month?: number;
  year?: number;
  category?: string;
  search?: string;
}): Promise<Transaction[]> {
  let query = getSupabase()
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (filters?.year && filters?.month) {
    const startDate = `${filters.year}-${String(filters.month).padStart(2, "0")}-01`;
    const endDate =
      filters.month === 12
        ? `${filters.year + 1}-01-01`
        : `${filters.year}-${String(filters.month + 1).padStart(2, "0")}-01`;
    query = query.gte("date", startDate).lt("date", endDate);
  }

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters?.search) {
    query = query.ilike("description", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Transaction[];
}

export async function createTransaction(
  data: TransactionFormData
): Promise<Transaction> {
  const {
    data: { user },
  } = await getSupabase().auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const { data: transaction, error } = await getSupabase()
    .from("transactions")
    .insert({
      ...data,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return transaction as Transaction;
}

export async function updateTransaction(
  id: string,
  data: TransactionFormData
): Promise<Transaction> {
  const { data: transaction, error } = await getSupabase()
    .from("transactions")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return transaction as Transaction;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await getSupabase().from("transactions").delete().eq("id", id);
  if (error) throw error;
}
