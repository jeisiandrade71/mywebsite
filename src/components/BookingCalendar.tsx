"use client";

import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface EventInput {
  id: string;
  title: string;
  start: string;
  end: string;
  teamLeadId: string | null;
}

export default function BookingCalendar({
  events,
  teamLeads,
}: {
  events: EventInput[];
  teamLeads: { id: string; name: string }[];
}) {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const calendarEvents = useMemo(() => {
    return events
      .filter((e) => filter === "all" || e.teamLeadId === filter)
      .map((e) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
      }));
  }, [events, filter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          Filtrar por chefe de equipe:
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="all">Todos</option>
          {teamLeads.map((tl) => (
            <option key={tl.id} value={tl.id}>
              {tl.name}
            </option>
          ))}
        </select>
      </div>
      <div
        className="rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 dark:border-zinc-800"
        style={{ height: 700 }}
      >
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          culture="pt-BR"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          messages={{
            month: "Mês",
            week: "Semana",
            day: "Dia",
            today: "Hoje",
            previous: "Anterior",
            next: "Próximo",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Nenhum agendamento nesse período.",
            showMore: (total: number) => `+${total} mais`,
          }}
        />
      </div>
    </div>
  );
}
