import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Plus } from 'lucide-react'; 

import { useAuth } from '../context'; 
import { api } from '../services';
import { useDataFilter } from '../hooks';
import { Tray, SearchBar, CardTournament, Loading, Button } from '../components';

const STATUS_RANK = { 'ONGOING': 3, 'UPCOMING': 2, 'FINISHED': 1, 'CANCELED': 0 };

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  const { token, user } = useAuth(); 
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('show-all'); 
  const [sortBy, setSortBy] = useState('Date'); 
  const [sortDirection, setSortDirection] = useState('asc'); 

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/tournaments?filter=mine', token);
        
        // We ensure the flat 'title' and 'status' properties exist for the hook
        const formatted = data.map(t => ({
          title: t.name,
          status: t.status,
          startDate: t.start_date, // needed for sorting
          raw: {
            tournamentId: t.tournament_id,
            name: t.name,
            description: t.description,
            status: t.status,
            location: t.location,
            imageUrl: t.image_url,
            startDate: t.start_date,
            endDate: t.end_date,
            myStatus: t.my_status || null 
          },
          creatorName: t.creator_name,
        }));
        setTournaments(formatted);
      } catch (error) { 
        console.error("Failed to fetch tournaments:", error); 
      } finally { 
        setIsLoading(false); 
      }
    };

    if (token) fetchTournaments();
  }, [token]);

  // --- UNIVERSAL FILTER & SORT HOOK ---
  const processedList = useDataFilter(
    tournaments,
    { searchQuery, sortBy, sortDirection },
    {
      searchKeys: ['title'], // Search specifically in the title
      sortStrategies: {
        'Status': (a, b) => (STATUS_RANK[b.status] || 0) - (STATUS_RANK[a.status] || 0),
        'Title': (a, b) => a.title.localeCompare(b.title),
        'Date': (a, b) => new Date(a.startDate) - new Date(b.startDate)
      }
    }
  );

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold'>My Tournaments</div>
        <div className='text-secondary-accent font-medium font-roboto'>Events you are organizing or participating in</div>
      </div>

      <div className='col-start-4 col-span-6 flex flex-col gap-6 mt-6'>
        <SearchBar 
            onSearch={setSearchQuery} 
            onSortChange={setSortBy} 
            onDirectionToggle={setSortDirection} 
            sortOptions={['Status', 'Title', 'Date']} 
            defaultSearchValue="show-all" 
            defaultSort="Date" 
        />
      </div>
      
      <div className='col-start-2 col-span-10 flex justify-end items-end'>
        {isAdmin && (
          <Button variant='primary' onClick={() => navigate('/create-tournament')} className="flex items-center gap-2">
            <Plus size={18} /> New Tournament
          </Button>
        )}
      </div>

      <Tray 
        pos='col-start-2' 
        size='col-span-10' 
        variant='grid' 
        title={
            <div className="flex items-center gap-2 pb-4 mb-2 border-b border-gray-100">
                <List className="text-primary-accent" size={24} />
                <h2 className="text-2xl font-bold font-outfit text-primary-accent">
                    Your Events
                </h2>
            </div>
        }
      >
        {isLoading ? (
          <div className="col-span-full text-center py-10"><Loading text='Loading...' /></div>
        ) : processedList.length > 0 ? (
            processedList.map((item, idx) => (
                <CardTournament 
                    key={idx}
                    tournament={item.raw}
                    creatorName={item.creatorName}
                    onAction={() => navigate(`/tournament/${item.raw.tournamentId}`)}
                />
            ))
        ) : (
            <div className="col-span-full text-center py-10 text-gray-400 font-medium font-roboto flex flex-col items-center gap-2">
                <span>You haven't joined any tournaments yet.</span>
                {isAdmin ? (
                  <span>Create one to get started!</span>
                ) : (
                  <span className="text-sm">Contact an admin to register for an event.</span>
                )}
            </div>
        )}
      </Tray>
    </>
  );
};

export default Tournaments;