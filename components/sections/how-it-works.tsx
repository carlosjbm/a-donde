const steps = [
  {
    number: "1",
    title: "Define tu presupuesto",
    description:
      "Establece cuánto planeas gastar este mes en productos de primera necesidad.",
    icon: "📋",
  },
  {
    number: "2",
    title: "Compara precios y distancia",
    description:
      "Explora los precios de diferentes lugares cerca de ti y encuentra las mejores ofertas.",
    icon: "📍",
  },
  {
    number: "3",
    title: "Ahorra con inteligencia",
    description:
      "Elige dónde comprar combinando los mejores precios con la cercanía a tu ubicación.",
    icon: "💰",
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
          En tres pasos simples empieza a ahorrar en tus compras
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.number} className="relative flex flex-col items-center text-center">
            {i < steps.length - 1 && (
              <div className="absolute left-[60%] top-8 hidden h-px w-[80%] border-t-2 border-dashed border-zinc-300 sm:block dark:border-zinc-700" />
            )}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-950/50">
              {step.icon}
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
