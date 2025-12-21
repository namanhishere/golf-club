import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Compass, Users, Trophy } from 'lucide-react';

import { useAuth } from '@/context';
import { api } from '@/services'; 
import { SearchBar, ViewToggle, Loading } from '@/components';

const DirectoryLayout = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data State
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Shared Filter State
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sortBy, setSortBy] = useState('Name'); 
  const [sortDirection, setSortDirection] = useState('asc'); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, tournamentsData] = await Promise.all([
        api.get('/users', token),
        api.get('/tournaments?status=UPCOMING', token)
      ]);
      setMembers(usersData);
      setEvents(tournamentsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Determine active tab
  const currentPath = location.pathname.split('/').pop();
  const activeTab = currentPath === 'directory' ? 'members' : currentPath;

  const handleTabChange = (id) => {
    setSearchQuery(''); // Reset search on tab switch
    navigate(id === 'members' ? '/directory' : `/directory/${id}`);
  };

  // Dynamic tabs with counts
  const tabs = [
    { id: 'members', label: `Members (${members.length})`, icon: Users },
    { id: 'events', label: `Events (${events.length})`, icon: Trophy }
  ];

  if (loading) return <Loading />;

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold mb-4'>Directory</div>
        <div className='text-secondary-accent font-medium font-roboto'>Find members and open events</div>
        
        <div className='mt-6'>
          <ViewToggle options={tabs} activeId={activeTab} onToggle={handleTabChange} />
        </div>
      </div>

      <div className='col-start-4 col-span-6 flex flex-col gap-4'>
        <SearchBar
          onSearch={setSearchQuery}
          onSortChange={setSortBy} 
          onDirectionToggle={setSortDirection}
          sortOptions={['Name']}
          defaultSearchValue={searchQuery}
          defaultSort='Name'
        />
      </div>

      {/* Pass filter state AND data to children */}
      <Outlet context={{ 
        searchQuery, 
        sortBy, 
        sortDirection,
        rawMembers: members,
        rawEvents: events,
        refreshDirectory: fetchData
      }} />
    </>
  );
};

export default DirectoryLayout;