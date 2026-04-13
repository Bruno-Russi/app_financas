"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { getTransactions } from "@/lib/transactions";
import type { Transaction } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { CategoryPieChart } from "@/components/category-pie-chart";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions({ month, year });
      setTransactions(data);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const totalReceitas = transactions
    .filter((t) => t.type === "receita")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalDespesas = transactions
    .filter((t) => t.type === "despesa")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const saldo = totalReceitas - totalDespesas;

  const despesasPorCategoria = CATEGORIES.map((cat) => {
    const total = transactions
      .filter((t) => t.type === "despesa" && t.category === cat)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { name: cat, value: total };
  }).filter((item) => item.value > 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Select
            value={String(month)}
            onValueChange={(v) => v && setMonth(Number(v))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(year)}
            onValueChange={(v) => v && setYear(Number(v))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {loading ? "..." : formatCurrency(totalReceitas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {loading ? "..." : formatCurrency(totalDespesas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo
            </CardTitle>
            <DollarSign
              className={`h-5 w-5 ${saldo >= 0 ? "text-emerald-600" : "text-red-500"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${saldo >= 0 ? "text-emerald-600" : "text-red-500"}`}
            >
              {loading ? "..." : formatCurrency(saldo)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie chart */}
      <Card>
        <CardHeader>
          <CardTitle>Despesas por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Carregando...
            </div>
          ) : despesasPorCategoria.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Nenhuma despesa registrada neste período.
            </div>
          ) : (
            <CategoryPieChart data={despesasPorCategoria} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
