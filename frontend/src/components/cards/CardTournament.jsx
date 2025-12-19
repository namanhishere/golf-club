import React from 'react';
import PropTypes from 'prop-types';
import { Trophy, Calendar, MapPin, ArrowRight } from 'lucide-react';
import CardBase from './CardBase';

const CardTournament = ({ tournament, onAction }) => {
  
  const formatDateTimeRange = (start, end) => {
    if (!start) return 'Date TBD';
    const s = new Date(start);
    const e = end ? new Date(end) : null;
    const dateStr = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (e) {
      const isSameDay = s.toDateString() === e.toDateString();
      if (isSameDay) {
        const startTime = s.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
        const endTime = e.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
        return `${dateStr}, ${startTime} - ${endTime}`;
      } else {
        const endDateStr = e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `${dateStr} - ${endDateStr}`;
      }
    }
    return dateStr;
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'ONGOING': '#10b981',
      'UPCOMING': '#3b82f6',
      'FINISHED': '#64748b',
      'CANCELED': '#ef4444',
    };
    return statusMap[status] || '#f97316';
  };

  return (
    <CardBase
      primaryColor={getStatusColor(tournament.status)}
      Icon={Trophy}
      title={tournament.name}
      avatarUrl={tournament.imageUrl} 
      subtitle={tournament.description}
      badgeLabel={tournament.status}
      metaData={[
        { icon: Calendar, text: formatDateTimeRange(tournament.startDate, tournament.endDate) },
        { icon: MapPin, text: tournament.location || 'Location TBD' }
      ]}
      btnText="View Details"
      BtnIcon={ArrowRight}
      onAction={onAction}
    />
  );
};

CardTournament.propTypes = {
  tournament: PropTypes.shape({
    status: PropTypes.string,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
  onAction: PropTypes.func,
};

export default CardTournament;