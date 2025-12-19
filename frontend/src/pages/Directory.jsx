import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Users, Trophy } from 'lucide-react';

import { useAuth } from '../context';
import { api } from '../services';
import { useDataFilter } from '../hooks';
import { Tray, CardUser, CardTournament, SearchBar, Pagination, Loading, ViewToggle } from '../components';

const ITEMS_PER_PAGE = 12;
const VIEW_OPTIONS = [
  { id: 'members', label: 'Members', icon: Users },
  { id: 'tournaments', label: 'Events', icon: Trophy }
];

const Directory = () => {
  // State
  const [viewMode, setViewMode] = useState('members'); 
  const [data, setData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sortBy, setSortBy] = useState('Name'); 
  const [sortDirection, setSortDirection] = useState('asc'); 
  const [currentPage, setCurrentPage] = useState(1);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  // --- API Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setData([]); 
        
        const endpoint = viewMode === 'members' ? '/users' : '/tournaments?status=UPCOMING';
        const result = await api.get(endpoint, token);
        
        const formatted = result.map(item => {
            if (viewMode === 'members') {
                return {
                    // Flatten keys for easier searching/sorting
                    name: `${item.first_name} ${item.last_name}`,
                    role: item.role,
                    raw: {
                        userId: item.user_id,
                        firstName: item.first_name,
                        lastName: item.last_name,
                        email: item.email,
                        bio: item.bio,
                        profilePicUrl: item.profile_pic_url,
                        backgroundColorHex: item.background_color_hex
                    },
                };
            } else {
                return {
                    name: item.name,
                    status: item.status,
                    raw: {
                        tournamentId: item.tournament_id,
                        name: item.name,
                        status: item.status,
                        description: item.description,
                        location: item.location,
                        imageUrl: item.image_url,
                        startDate: item.start_date,
                        endDate: item.end_date
                    },
                    creatorName: item.creator_name || 'Admin'
                };
            }
        });
        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch directory data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, viewMode]);

  // --- UNIVERSAL FILTER & SORT HOOK ---
  const processedData = useDataFilter(
    data, 
    { searchQuery, sortBy, sortDirection }, 
    { 
      // Tell the hook to look at the 'name' property we created above
      searchKeys: ['name'],
      // We can add specific sort strategies here if needed, 
      // but the default string sort works perfectly for 'Name'
      sortStrategies: {
        'Name': (a, b) => a.name.localeCompare(b.name)
      }
    }
  );

  // Pagination Logic
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const currentItems = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold'>Directory</div>
        <div className='text-secondary-accent font-medium font-roboto'>Find members and open events</div>
      </div>

      <div className='col-start-4 col-span-6 flex flex-col gap-4'>
        <ViewToggle options={VIEW_OPTIONS} activeId={viewMode} onToggle={setViewMode} />
        <SearchBar
          onSearch={setSearchQuery}
          onSortChange={setSortBy} 
          onDirectionToggle={setSortDirection}
          sortOptions={['Name']}
          defaultSearchValue=""
          defaultSort='Name'
        />
      </div>

      <Tray 
        pos='col-start-2' size='col-span-10' variant='grid'
        title={
          <div className="flex items-center justify-start gap-2 w-full border-b border-gray-100 pb-4 mb-2">
            <Compass className="text-primary-accent" size={24} />
            <h2 className="text-2xl font-bold font-outfit text-primary-accent">
              {viewMode === 'members' ? 'Club Members' : 'Open Tournaments'}
            </h2>
          </div>
        }
      >
        {isLoading ? (
          <div className="col-span-full text-center py-10"><Loading text='Loading...' /></div>
        ) : currentItems.length > 0 ? (
          currentItems.map((item, idx) => (
            viewMode === 'members' ? (
                <CardUser 
                    key={idx}
                    user={item.raw}
                    role={item.role}
                    onAction={() => navigate(`/profile/${item.raw.userId}`)}
                />
            ) : (
                <CardTournament
                    key={idx}
                    tournament={item.raw}
                    creatorName={item.creatorName}
                    onAction={() => navigate(`/tournament/${item.raw.tournamentId}`)}
                />
            )
          ))
        ) : (
          <div className="col-span-full text-center text-sm font-medium text-txt-dark py-10">No results found.</div>
        )}
      </Tray>

      {processedData.length > ITEMS_PER_PAGE && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
};

export default Directory;