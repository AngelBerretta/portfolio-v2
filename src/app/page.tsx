// src/app/page.tsx
import { KitToggle } from "@/components/shared/KitToggle";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";

export default function Home() {
  return (
    <main className="min-h-dvh p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header con toggle */}
        <header className="flex items-center justify-between">
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fase 3 — Design System
          </h1>
          <KitToggle />
        </header>

        {/* Sección: Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Sección: Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="live">● LIVE</Badge>
            <Badge variant="win">Victoria</Badge>
            <Badge variant="loss">Derrota</Badge>
            <Badge variant="draw">Empate</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="champions">Champions</Badge>
            <Badge variant="continental">Continental</Badge>
            <Badge variant="playoff">Playoff</Badge>
            <Badge variant="relegation">Descenso</Badge>
          </div>
        </section>

        {/* Sección: Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-semibold mb-2">Card normal</h3>
              <p className="text-text-secondary text-sm">
                Fondo bg-card con borde sutil. Contenedor base del portfolio.
              </p>
            </Card>
            <Card elevated>
              <h3 className="font-semibold mb-2">Card elevada</h3>
              <p className="text-text-secondary text-sm">
                Fondo bg-elevated. Para destacar contenido sobre otras cards.
              </p>
            </Card>
          </div>
        </section>

        {/* Sección: Texto */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Escala tipográfica</h2>
          <div className="space-y-2">
            <p className="text-text-primary text-lg">
              Texto primario — información principal
            </p>
            <p className="text-text-secondary">
              Texto secundario — información de apoyo
            </p>
            <p className="text-text-muted text-sm">
              Texto muted — detalles, metadata
            </p>
            <p className="text-text-disabled text-sm">
              Texto disabled — elementos inactivos
            </p>
          </div>
        </section>

        {/* Sección: Acento */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Acento</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-accent text-text-inverse px-4 py-2 rounded-md font-medium">
              bg-accent
            </div>
            <div className="bg-accent-ghost text-accent px-4 py-2 rounded-md font-medium border border-accent/30">
              bg-accent-ghost
            </div>
            <div className="text-accent font-medium px-4 py-2">
              text-accent
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}