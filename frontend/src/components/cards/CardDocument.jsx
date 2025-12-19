import React from 'react';
import PropTypes from 'prop-types';
import { FileText, ShieldAlert, ExternalLink, User } from 'lucide-react';
import CardBase from './CardBase';

const CardDocument = ({ doc, authorName, onAction }) => {
  // 1. Configuration Strategy
  const getConfig = (type) => {
    switch (type) {
      case 'BCN_BYLAW':
        return { color: '#10b981', label: 'Official Doc', Icon: FileText }; // Emerald
      case 'BENEFIT':
        return { color: '#8b5cf6', label: 'Benefit', Icon: ShieldAlert };   // Violet
      default:
        return { color: '#64748b', label: 'Document', Icon: FileText };     // Slate fallback
    }
  };

  const config = getConfig(doc.type);

  // 2. Safe Date Formatting
  const dateStr = doc.createdAt 
    ? new Date(doc.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    : 'Date Unknown';

  return (
    <CardBase
      primaryColor={config.color}
      Icon={config.Icon}
      title={doc.title}
      subtitle={`Published: ${dateStr}`}
      badgeLabel={config.label}
      
      // Metadata
      metaData={[
        { icon: User, text: authorName || 'Admin' }
      ]}

      btnText="Read Document"
      BtnIcon={ExternalLink}
      onAction={onAction}
    />
  );
};

CardDocument.propTypes = {
  doc: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  authorName: PropTypes.string,
  onAction: PropTypes.func,
};

export default CardDocument;