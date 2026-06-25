import { Store, ClipboardList, Users } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Administra tus lugares",
    description:
      "Registra tus tiendas de confianza, sus productos y precios reales. Entre más compartas, más ayudas a tu comunidad a encontrar dónde comprar mejor.",
    icon: Store,
  },
  {
    number: "2",
    title: "Planifica tu despensa",
    description:
      "Define tu presupuesto mensual, organiza tus productos esenciales y crea packs personalizados para tus próximas compras. Todo bajo tu control.",
    icon: ClipboardList,
  },
  {
    number: "3",
    title: "Colabora y ahorra",
    description:
      "Descubre precios registrados por otros usuarios, encuentra ofertas cerca de ti y ahorra en equipo. Todos podemos ayudarnos a comprar mejor.",
    icon: Users,
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Cómo funciona
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          En tres pasos empieza a colaborar con tu comunidad y ahorra en tus compras
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.number} className="relative flex flex-col items-center text-center">
            {i < steps.length - 1 && (
              <div className="absolute left-[60%] top-8 hidden h-px w-[80%] border-t-2 border-dashed border-zinc-300 sm:block dark:border-zinc-700" />
            )}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50">
              <step.icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-4 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900">
              {step.number}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
