import React from 'react';
import { Event } from '../types';

interface Props {
  event: Event;
  onParticipate: () => void;
}

const EventCard: React.FC<Props> = ({ event, onParticipate }) => {
  return (
    <div className="bg-white shadow rounded overflow-hidden flex flex-col">
      <img
        src={event.banner_url}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 flex-1">{event.title}</h2>
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={onParticipate}
        >
          Teilnehmen
        </button>
      </div>
    </div>
  );
};

export default EventCard;