import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { NavArrowLeft } from "iconoir-react";

export const metadata: Metadata = {
  title: "Disclaimer / Rechtliche Hinweise",
};

const sections = [
  {
    title: "1. Allgemeines",
    body: (
      <p>
        Dies ist eine private Fan-Website. Sie soll dir helfen, schnell und
        einfach aktuelle SHiFT-Codes für die Borderlands-Reihe zu finden. Ich
        habe keinerlei geschäftliche oder rechtliche Verbindung zu Gearbox
        Software, 2K Games oder anderen offiziellen Stellen.
      </p>
    ),
  },
  {
    title: "2. Keine Garantie",
    body: (
      <p>
        Alle Codes und Infos hier werden nach bestem Wissen gesammelt. Trotzdem
        kann ich nicht garantieren, dass sie jederzeit aktuell, vollständig oder
        gültig sind. SHiFT-Codes können ablaufen oder ungültig sein – probier es
        also immer auf eigene Verantwortung.
      </p>
    ),
  },
  {
    title: "3. Haftungsausschluss",
    body: (
      <p>
        Du nutzt diese Website auf eigenes Risiko. Für Schäden oder Probleme,
        die durch die Nutzung oder Nichtnutzung der Infos entstehen, übernehme
        ich keine Haftung.
      </p>
    ),
  },
  {
    title: "4. Marken- und Urheberrechte",
    body: (
      <p>
        Alle genannten Marken, Logos und Spieleinhalte gehören den jeweiligen
        Rechteinhabern. Diese Seite ist ein reines Fanprojekt und steht in
        keinem offiziellen Zusammenhang mit Gearbox oder 2K. Eigene Inhalte
        dieser Seite (Texte, Struktur, Design) sind – soweit nicht anders
        gekennzeichnet – von mir erstellt.
      </p>
    ),
  },
  {
    title: "5. Externe Links",
    body: (
      <p>
        Auf der Seite findest du Links zu externen Websites (z. B. offizielle
        Gearbox-Seiten). Für deren Inhalte bin ich nicht verantwortlich. Zum
        Zeitpunkt der Verlinkung waren keine problematischen Inhalte erkennbar.
      </p>
    ),
  },
  {
    title: "6. Datenschutz",
    body: (
      <p>
        Ich selbst habe kein Interesse daran, deine persönlichen Daten zu
        sammeln. Falls ich Statistiken (z. B. über Seitenaufrufe) nutze, dann
        nur anonymisiert und ohne Rückschluss auf dich als Person. Wenn du
        Fragen dazu hast, melde dich gerne.
      </p>
    ),
  },
  {
    title: "7. Impressum",
    body: (
      <div className="space-y-1">
        <span className="block">Verantwortlich für diese Website:</span>
        <span className="block">Mutige Mungos</span>
      </div>
    ),
  },
];

const credits = [
  {
    name: "Next.js (Vercel)",
    description: "Framework für React-Anwendungen",
  },
  {
    name: "React & TypeScript",
    description: "Moderne Basis für modulare Frontend-Entwicklung",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS Framework",
  },
  {
    name: "shadcn/ui",
    description: "UI-Komponenten für React & Tailwind",
  },
  {
    name: "Matomo & @socialgouv/matomo-next",
    description: "Datenschutzfreundliche Webanalyse",
  },
  {
    name: "iconoir-react",
    description: "Vektor-Icons für die UI",
  },
  {
    name: "clsx, class-variance-authority & tailwind-merge",
    description: "Helfer für saubere CSS-Kombinationen",
  },
  {
    name: "pnpm",
    description: "Performanter Paketmanager",
  },
];

function BackButton() {
  return (
    <Button
      asChild
      variant="ghost"
      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-foreground shadow-sm transition hover:bg-muted/70"
    >
      <Link href="/">
        <NavArrowLeft className="h-4 w-4" aria-hidden />
        Zurück zu den Codes
      </Link>
    </Button>
  );
}

export default function DisclaimerPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 sm:px-8">
      <div className="flex justify-start">
        <BackButton />
      </div>

      <article className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-10">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Disclaimer / Rechtliche Hinweise
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Transparenz ist mir wichtig. Bitte nimm dir einen Moment Zeit und
            lies dir die folgenden Punkte durch, damit du weißt, wie diese
            Fan-Seite funktioniert und welche Rahmenbedingungen gelten.
          </p>
        </header>

        <ol className="mt-10 space-y-12 text-base leading-relaxed text-muted-foreground">
          {sections.map((section) => (
            <li key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <div className="space-y-3 text-base text-muted-foreground">
                {section.body}
              </div>
            </li>
          ))}
          <li className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              8. Credits
            </h2>
            <p>
              Diese Website nutzt Open-Source-Software, ohne die sie nicht
              möglich wäre. Ein besonderer Dank geht an die Entwicklerinnen und
              Entwickler der folgenden Projekte:
            </p>
            <ul className="space-y-2 pl-5 marker:text-muted-foreground">
              {credits.map((item) => (
                <li
                  key={item.name}
                  className="list-disc text-base text-muted-foreground"
                >
                  <span className="font-medium text-foreground">
                    {item.name}
                  </span>
                  {" – "}
                  {item.description}
                </li>
              ))}
            </ul>
            <p>
              Alle genannten Projekte stehen unter ihren jeweiligen
              Open-Source-Lizenzen.
            </p>
          </li>
        </ol>
      </article>

      <div className="flex justify-start">
        <BackButton />
      </div>
    </main>
  );
}
