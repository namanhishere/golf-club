import { Activity, Clock4, CircleX, HelpCircle } from 'lucide-react';

export const getStatusConfig = (status) => {
  const configs = {
    'Ongoing': {
      itemBorder: 'border-green-200 hover:border-green-300', 
      badgeClasses: 'bg-green-100 text-green-700 border-green-200',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      Icon: Activity
    },
    'Processing': {
      itemBorder: 'border-yellow-200 hover:border-yellow-300', 
      badgeClasses: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      Icon: Clock4,
    },
    'Ended': {
      itemBorder: 'border-red-200 hover:border-red-300', 
      badgeClasses: 'bg-red-100 text-red-700 border-red-200',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      Icon: CircleX
    }
  };

  return configs[status] || {
    itemBorder: 'border-gray-200 hover:border-gray-300', 
    badgeClasses: 'bg-gray-100 text-gray-700 border-gray-200',
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    Icon: HelpCircle
  };
};