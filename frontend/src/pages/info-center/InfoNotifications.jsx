import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { List, RefreshCcw } from 'lucide-react';
import { Tray, CardNotification, Button } from '@/components';

const InfoNotifications = () => {
  // Get raw data and refresh function from Layout context
  const { rawNotifs, refreshInfo } = useOutletContext();

  // Format data for the Card component
  const items = useMemo(() => {
  return rawNotifs.map(item => ({
    raw: {
      notificationId: item.notification_id,
      title: item.title,
      content: item.content,
      createdAt: item.created_at
    },
    authorName: item.author_name
  }));
  }, [rawNotifs]);

  return (
  <Tray 
    pos="col-start-2" size="col-span-10" variant="grid" 
    title={
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100 w-full animate-fadeIn">
        <div className="flex items-center gap-2">
          <List className="text-primary-accent" />
          <h2 className="text-2xl font-bold font-outfit text-primary-accent">
            Notifications
          </h2>
        </div>
        <Button variant="ghost" onClick={refreshInfo}>
          <RefreshCcw size={18} />
        </Button>
      </div>
    }
  >
    {items.length > 0 ? (
      items.map((item, idx) => (
        <div key={idx} className="animate-fadeIn w-full h-full">
          <CardNotification 
            notification={item.raw} 
            authorName={item.authorName}
            onAction={() => alert(`Mark read ${item.raw.notificationId}`)} 
          />
        </div>
      ))
    ) : <div className="col-span-full text-center text-gray-400">No notifications.</div>}
  </Tray>
  );
};

export default InfoNotifications;