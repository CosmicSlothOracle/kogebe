import React, { useEffect, useState } from 'react';
import { Event } from '../types';

const DataExport: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    // TODO: replace with real API call (+ auth)
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        setEvents(json.events);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
    fetchEvents();
  }, []);

  const handleDownload = async (fmt: 'csv' | 'json') => {
    if (!selectedId) return;
    // TODO: Add auth token header if required
    window.open(`/api/events/${selectedId}/export?fmt=${fmt}`, '_blank');
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Teilnehmer exportieren</h3>
      <select
        className="border p-2 rounded w-full mb-3"
        value={selectedId ?? ''}
        onChange={(e) => setSelectedId(Number(e.target.value))}
      >
        <option value="" disabled>
          Event wählen
        </option>
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded disabled:opacity-50"
          disabled={!selectedId}
          onClick={() => handleDownload('csv')}
        >
          CSV
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded disabled:opacity-50"
          disabled={!selectedId}
          onClick={() => handleDownload('json')}
        >
          JSON
        </button>
      </div>
    </div>
  );
};

export default DataExport;