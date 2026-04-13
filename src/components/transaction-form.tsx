"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction, updateTransaction } from "@/lib/transactions";
import type { Transaction, TransactionType, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({
  transaction,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const [description, setDescription] = useState(transaction?.description || "");
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : ""
  );
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<TransactionType>(transaction?.type || "despesa");
  const [category, setCategory] = useState<Category>(transaction?.category || "Outros");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Insira um valor válido maior que zero.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        description,
        amount: parsedAmount,
        date,
        type,
        category,
      };

      if (transaction) {
        await updateTransaction(transaction.id, data);
      } else {
        await createTransaction(data);
      }
      onSuccess();
    } catch {
      setError("Erro ao salvar transação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex: Almoço, Salário..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={(v) => v && setType(v as TransactionType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={category} onValueChange={(v) => v && setCategory(v as Category)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={loading}
        >
          {loading ? "Salvando..." : transaction ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
