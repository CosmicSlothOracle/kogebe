import React, { useEffect, useState } from 'react';
import EventCard from './components/EventCard';
import ParticipantForm from './components/ParticipantForm';
import { Event } from './types';

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // TODO: replace with real API call
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        setEvents(json.events);
      } catch (err) {
        console.error('Failed to load events', err);
      }
    }
    fetchEvents();
  }, []);

  const handleParticipate = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseForm = () => setSelectedEvent(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">KOSGE Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} onParticipate={() => handleParticipate(ev)} />
        ))}
      </div>

      {selectedEvent && (
        <ParticipantForm event={selectedEvent} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default App;