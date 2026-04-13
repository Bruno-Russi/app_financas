"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Mail, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setEmailSent(true);
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Mail className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Verifique seu e-mail</CardTitle>
            <CardDescription className="text-base">
              Enviamos um link de confirmação para:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="font-medium text-sm break-all">{email}</p>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-center">
                Abra sua caixa de entrada e clique no link para ativar sua conta.
                Depois disso, você já pode fazer login.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-amber-800 dark:text-amber-200 text-sm">
                <p>
                  Não encontrou o e-mail? Verifique a pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/login">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Ir para o Login
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setEmailSent(false);
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Usar outro e-mail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold">FinançasPRO</span>
            </Link>
          </div>
          <CardTitle className="text-2xl">Criar sua conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para começar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
