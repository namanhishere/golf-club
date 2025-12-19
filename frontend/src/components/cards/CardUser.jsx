import React from 'react';
import PropTypes from 'prop-types';
import { User, ArrowRight, Mail } from 'lucide-react';
import CardBase from './CardBase';

const CardUser = ({ user, role = 'MEMBER', onAction }) => {
  const primaryColor = user.backgroundColorHex || '#3b82f6'; 
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <CardBase
      primaryColor={primaryColor}
      Icon={User}
      title={fullName}
      subtitle={user.bio} 
      avatarUrl={user.profilePicUrl} 
      badgeLabel={role} 
      metaData={[
        { icon: Mail, text: user.email }
      ]}
      btnText="View Profile"
      BtnIcon={ArrowRight}
      onAction={onAction}
    />
  );
};

CardUser.propTypes = {
  user: PropTypes.shape({
    backgroundColorHex: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    bio: PropTypes.string,
    profilePicUrl: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  role: PropTypes.string,
  onAction: PropTypes.func,
};

export default CardUser;