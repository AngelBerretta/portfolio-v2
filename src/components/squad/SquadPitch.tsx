'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { useRevealOnScroll } from '@/animations/useRevealOnScroll';
import { MatchdayBadge } from '@/components/shared/MatchdayBadge';
import { PitchMarkings } from './PitchMarkings';
import { SkillIcon } from './SkillIcon';
import { buildFormation } from './formation';
import type { SkillCategoryId, SquadPlayer, SquadSkill } from './types';

/** Titulares por equipo. Lo que pase de acá se va al banco. */
const FIELD_SIZE = 11;

// Las clases van escritas enteras para que Tailwind las genere. Los colores
// salen de los tokens pos-* de globals.css (cambian con el kit home / away).
const TEAMS: Record<
  SkillCategoryId,
  { label: string; code: string; chip: string; codeBox: string; border: string }
> = {
  frontend: {
    label: 'Frontend',
    code: 'LOC',
    chip: 'border-pos-continental/30 bg-pos-continental/10 text-pos-continental',
    codeBox: 'bg-pos-continental text-text-inverse',
    border: 'border-pos-continental',
  },
  backend: {
    label: 'Backend',
    code: 'VIS',
    chip: 'border-pos-champions/30 bg-pos-champions/10 text-pos-champions',
    codeBox: 'bg-pos-champions text-text-inverse',
    border: 'border-pos-champions',
  },
  tools: {
    label: 'Herramientas',
    code: 'DT',
    chip: 'border-pos-champions-playoff/30 bg-pos-champions-playoff/10 text-pos-champions-playoff',
    codeBox: 'bg-pos-champions-playoff text-text-inverse',
    border: 'border-pos-champions-playoff',
  },
};

const toPlayers = (skills: SquadSkill[], team: SkillCategoryId): SquadPlayer[] =>
  skills.map((skill) => ({ skill, team }));

// ─── Piezas ──────────────────────────────────────────────────────────────────

/** Mismo patrón que ScoreBadge: código decorativo + texto que carga el significado. */
function TeamChip({
  team,
  children,
}: {
  team: SkillCategoryId;
  children: React.ReactNode;
}) {
  const t = TEAMS[team];
  return (
    <span
      className={cn(
        'inline-flex items-stretch overflow-hidden rounded-md border font-mono text-[11px] font-semibold',
        t.chip
      )}
    >
      <span aria-hidden="true" className={cn('px-1.5 py-0.5 tracking-wider', t.codeBox)}>
        {t.code}
      </span>
      <span className="px-2 py-0.5">{children}</span>
    </span>
  );
}

// Dos tamaños. En la cancha todo escala con el ancho de la propia cancha
// (1cqw = 1% del ancho del contenedor `@container`), así las 4 líneas de cada
// equipo siempre entran sin importar el celular. En el banco son fijos.
const TOKEN_SIZES = {
  pitch: {
    button: 'min-w-0 gap-0.5 p-0.5',
    icon: 'size-[clamp(1.5rem,9cqw,2.75rem)]',
    glyph: 'h-[58%] w-[58%]',
    label: 'whitespace-nowrap px-1 text-[length:clamp(9px,3.2cqw,12px)]',
  },
  bench: {
    button: 'gap-1 p-1',
    icon: 'h-9 w-9 sm:h-11 sm:w-11',
    glyph: '',
    label: 'max-w-full break-words px-1.5 text-[11px]',
  },
} as const;

function PlayerToken({
  player,
  selected,
  onSelect,
  className,
  variant = 'bench',
}: {
  player: SquadPlayer;
  selected: boolean;
  onSelect: (id: string) => void;
  className?: string;
  variant?: keyof typeof TOKEN_SIZES;
}) {
  const { skill, team } = player;
  const t = TEAMS[team];
  const size = TOKEN_SIZES[variant];

  return (
    <button
      type="button"
      data-player
      onClick={() => onSelect(skill.id)}
      aria-pressed={selected}
      aria-label={`${skill.name}, ${t.label}`}
      className={cn('group flex flex-col items-center rounded-md', size.button, className)}
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border-2 bg-bg-card shadow-md',
          'transition-transform duration-200 group-hover:scale-110',
          size.icon,
          t.border,
          selected && 'scale-110 ring-2 ring-accent ring-offset-2 ring-offset-bg-secondary'
        )}
      >
        <SkillIcon skill={skill} className={size.glyph || undefined} />
      </span>
      <span
        className={cn(
          'rounded py-0.5 text-center font-mono font-medium leading-tight',
          size.label,
          selected ? 'bg-accent text-text-inverse' : 'bg-bg-body/75 text-text-primary'
        )}
      >
        {skill.name}
      </span>
    </button>
  );
}

/** Una mitad de la cancha. `reverse` invierte las líneas para el equipo de abajo. */
function TeamHalf({
  team,
  players,
  reverse,
  selectedId,
  onSelect,
}: {
  team: SkillCategoryId;
  players: SquadPlayer[];
  reverse?: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const lines = buildFormation(players);
  const ordered = reverse ? [...lines].reverse() : lines;

  return (
    <div
      role="group"
      aria-label={`Equipo ${TEAMS[team].label}`}
      className="flex min-h-0 flex-1 flex-col justify-around px-[3%] py-[3%]"
    >
      {ordered.map((line) => (
        <ul key={line.id} className="flex w-full justify-around">
          {line.players.map((player) => (
            <li key={player.skill.id} className="flex w-[23%] justify-center">
              <PlayerToken
                player={player}
                selected={selectedId === player.skill.id}
                onSelect={onSelect}
                variant="pitch"
                className="w-full"
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function BenchGroup({
  title,
  items,
  selectedId,
  onSelect,
}: {
  title: string;
  items: SquadPlayer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-5">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </h4>
      <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 xl:grid-cols-5">
        {items.map((player) => (
          <li key={player.skill.id}>
            <PlayerToken
              player={player}
              selected={selectedId === player.skill.id}
              onSelect={onSelect}
              className="w-full rounded-lg bg-bg-secondary py-2 transition-colors hover:bg-bg-elevated"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bench({
  staff,
  reserves,
  selectedId,
  onSelect,
}: {
  staff: SquadPlayer[];
  reserves: SquadPlayer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (staff.length === 0 && reserves.length === 0) return null;

  return (
    <section
      aria-labelledby="bench-heading"
      className="rounded-xl border border-border bg-bg-card p-5 lg:col-start-2 lg:row-start-2"
    >
      <MatchdayBadge code="SUP" title="Tecnologías que no juegan de titular">
        Suplentes
      </MatchdayBadge>
      <h3 id="bench-heading" className="mt-3 font-display text-2xl font-bold text-text-primary">
        Banco de suplentes
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
        Herramientas de apoyo y tecnologías en reserva, listas para entrar a la cancha.
      </p>

      <BenchGroup
        title="Cuerpo técnico · herramientas"
        items={staff}
        selectedId={selectedId}
        onSelect={onSelect}
      />
      <BenchGroup
        title="En reserva · esperan su turno"
        items={reserves}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </section>
  );
}

/**
 * Ficha del jugador elegido. En mobile queda fija abajo mientras la cancha
 * está en pantalla (si no, al tocar un jugador la descripción quedaría
 * fuera de vista); `mr-14` deja libre el botón "volver arriba".
 */
function PlayerDetail({ player }: { player: SquadPlayer | null }) {
  return (
    <aside
      aria-label="Ficha del jugador"
      className={cn(
        'rounded-xl border border-border bg-bg-card p-4 shadow-xl shadow-black/30',
        'max-lg:sticky max-lg:bottom-[max(1rem,env(safe-area-inset-bottom))] max-lg:z-30 max-lg:mr-14',
        'lg:col-start-2 lg:row-start-1 lg:p-5 lg:shadow-none'
      )}
    >
      <div aria-live="polite">
        {player ? (
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-bg-surface',
                TEAMS[player.team].border
              )}
            >
              <SkillIcon skill={player.skill} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="font-mono text-base font-semibold text-text-primary">
                  {player.skill.name}
                </h3>
                <TeamChip team={player.team}>{TEAMS[player.team].label}</TeamChip>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {player.skill.description || 'Todavía sin descripción.'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            Tocá un jugador para ver en qué lo uso.
          </p>
        )}
      </div>
    </aside>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export function SquadPitch({
  frontend,
  backend,
  tools,
}: {
  frontend: SquadSkill[];
  backend: SquadSkill[];
  tools: SquadSkill[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const topTeam = toPlayers(frontend.slice(0, FIELD_SIZE), 'frontend');
  const bottomTeam = toPlayers(backend.slice(0, FIELD_SIZE), 'backend');
  const reserves = [
    ...toPlayers(frontend.slice(FIELD_SIZE), 'frontend'),
    ...toPlayers(backend.slice(FIELD_SIZE), 'backend'),
  ];
  const staff = toPlayers(tools, 'tools');

  const selected =
    [...topTeam, ...bottomTeam, ...reserves, ...staff].find((p) => p.skill.id === selectedId) ??
    null;

  const toggle = (id: string) => setSelectedId((current) => (current === id ? null : id));

  const total = topTeam.length + bottomTeam.length + reserves.length + staff.length;
  const ref = useRevealOnScroll<HTMLDivElement>({
    target: '[data-player]',
    distance: 14,
    stagger: 0.025,
    dependencies: [total],
  });

  return (
    <div
      ref={ref}
      className="mx-auto flex max-w-5xl flex-col gap-6 lg:grid lg:grid-cols-[28rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10"
    >
      {/* Cancha */}
      <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <ul aria-label="Referencias" className="mb-4 flex flex-wrap justify-center gap-2">
          <li>
            <TeamChip team="frontend">Frontend · arriba</TeamChip>
          </li>
          <li>
            <TeamChip team="backend">Backend · abajo</TeamChip>
          </li>
          <li>
            <TeamChip team="tools">Herramientas · banco</TeamChip>
          </li>
        </ul>

        <div
          role="group"
          aria-label="Cancha: Frontend arriba y Backend abajo"
          className="@container relative mx-auto aspect-[68/105] w-full max-w-md overflow-hidden rounded-xl border border-border bg-bg-secondary"
        >
          <PitchMarkings className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex flex-col">
            <TeamHalf
              team="frontend"
              players={topTeam}
              selectedId={selectedId}
              onSelect={toggle}
            />
            <TeamHalf
              team="backend"
              players={bottomTeam}
              reverse
              selectedId={selectedId}
              onSelect={toggle}
            />
          </div>
        </div>
      </div>

      {/* El DOM va cancha → banco → ficha (en mobile la ficha queda fija abajo,
          y tiene que estar al final para seguir visible mientras se mira el
          banco). En desktop la ubican las clases lg:col/row-start. */}
      <Bench staff={staff} reserves={reserves} selectedId={selectedId} onSelect={toggle} />
      <PlayerDetail player={selected} />
    </div>
  );
}