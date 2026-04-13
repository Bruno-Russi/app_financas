"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Shield,
  Smartphone,
  Wallet,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">FinançasPRO</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Controle suas finanças de forma{" "}
              <span className="text-emerald-600">simples e visual</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Registre receitas e despesas, acompanhe seus gastos por categoria e
              tenha uma visão completa do seu dinheiro em um dashboard intuitivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8"
                >
                  Começar grátis <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tudo que você precisa para organizar seu dinheiro
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-emerald-600" />}
              title="Dashboard visual"
              description="Veja receitas, despesas e saldo em tempo real com gráficos interativos por categoria."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-emerald-600" />}
              title="Seguro e privado"
              description="Seus dados são protegidos com autenticação segura e cada usuário só vê suas próprias transações."
            />
            <FeatureCard
              icon={<Smartphone className="h-10 w-10 text-emerald-600" />}
              title="Responsivo"
              description="Acesse de qualquer dispositivo. Interface adaptável para desktop, tablet e celular."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 FinançasPRO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
