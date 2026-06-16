"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Plus,
  X,
  Edit3,
  MapPin,
  Trash2,
} from "lucide-react";
import { calendarEvents, calendarHours, weekDays } from "~/lib/mock-data";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";

export function CalendarPage() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [events, setEvents] = useState(calendarEvents);

  const selected = events.find((e) => e.id === selectedEvent);

  const handleEventClick = (id: string) => {
    setSelectedEvent(id);
    const ev = events.find((e) => e.id === id);
    if (ev) {
      setEditTitle(ev.title);
      setEditTime(ev.time);
      setEditEndTime(ev.endTime);
    }
    setIsEditingEvent(false);
  };

  const handleEdit = () => {
    setIsEditingEvent(true);
  };

  const handleSave = () => {
    if (selectedEvent && editTitle) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent
            ? {
                ...e,
                title: editTitle,
                time: editTime || e.time,
                endTime: editEndTime || e.endTime,
              }
            : e,
        ),
      );
      toast({ description: `Updated "${editTitle}"` });
    }
    setIsEditingEvent(false);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      const ev = events.find((e) => e.id === selectedEvent);
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent));
      setSelectedEvent(null);
      setIsEditingEvent(false);
      toast({ description: `Deleted "${ev?.title}"` });
    }
  };

  const handleNewEvent = () => {
    toast({ description: "New event creation coming soon" });
  };

  const getEventForSlot = (day: string, hour: string) => {
    return events.filter((e) => {
      const evHour = e.time.split(":")[0];
      const hourNum = parseInt(hour.split(" ")[0] as string);
      return e.day === day && parseInt(evHour as string) === hourNum;
    });
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-12 flex items-center justify-between px-4 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <span className="text-sm font-semibold">January 2024</span>
            <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover"
            onClick={handleNewEvent}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Event
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll">
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground pt-20">
            <Clock className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm">No calendar events found</p>
            <p className="text-xs opacity-70 mt-1">Connect your Google Calendar in the Integrations tab to see your schedule.</p>
          </div>
        </div>
      </div>

      {selected && (
        <div className="w-72 lg:w-80 flex-shrink-0 border-l border-border/30 flex flex-col animate-fade-in">
          <div className="h-12 flex items-center justify-between px-4 border-b border-border/30">
            <span className="text-sm font-semibold">Event Details</span>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setIsEditingEvent(false);
              }}
              className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4">
            {isEditingEvent ? (
              <>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Title</label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Start Time</label>
                  <input
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">End Time</label>
                  <input
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingEvent(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold">{selected.title}</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground/75">
                      {selected.day}, {selected.time} - {selected.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground/75">Video call</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Attendees ({selected.attendees.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.attendees.map((a) => (
                      <span
                        key={a}
                        className="px-2.5 py-1 rounded-lg bg-secondary/50 text-xs text-foreground/60 border border-border/30"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full",
                      selected.type === "recurring" && "bg-primary/10 text-primary",
                      selected.type === "one-on-one" && "bg-foreground/5 text-foreground/60",
                      selected.type === "sprint" && "bg-primary/10 text-primary",
                      selected.type === "client" && "bg-foreground/5 text-foreground/60",
                    )}
                  >
                    {selected.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border/20">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover"
                    onClick={handleEdit}
                  >
                    <Edit3 className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
