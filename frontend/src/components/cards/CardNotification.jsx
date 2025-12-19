import React from 'react';
import PropTypes from 'prop-types';
import { Bell, CheckCircle, User } from 'lucide-react';
import CardBase from './CardBase';

const CardNotification = ({ notification, authorName, onAction }) => {
  return (
    <CardBase
      primaryColor='#f97316'
      Icon={Bell}
      title={notification.title}           
      subtitle={notification.content}      
      badgeLabel="Alert"
      metaData={[
        { icon: User, text: authorName || 'System' }
      ]}
      btnText="Read Notrification"
      BtnIcon={CheckCircle}
      onAction={onAction}
    />
  );
};

CardNotification.propTypes = {
  notification: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  authorName: PropTypes.string,
  onAction: PropTypes.func,
};

export default CardNotification;