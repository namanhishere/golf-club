import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Compass, RefreshCcw } from 'lucide-react';

import { useDataFilter } from '@/hooks';
import { Tray, CardUser, Pagination, Button } from '@/components';

const ITEMS_PER_PAGE = 12;

const DirectoryMembers = () => {
  const navigate = useNavigate();
  // Destructure raw data passed from Layout
  const { rawMembers, refreshDirectory, searchQuery, sortBy, sortDirection } = useOutletContext(); 

  const [currentPage, setCurrentPage] = useState(1);

  // Format raw data for Card and Filtering
  const data = useMemo(() => {
    return rawMembers.map(item => ({
      name: `${item.first_name} ${item.last_name}`, 
      raw: {
          userId: item.user_id,
          firstName: item.first_name,
          lastName: item.last_name,
          email: item.email,
          bio: item.bio,
          profilePicUrl: item.profile_pic_url,
          backgroundColorHex: item.background_color_hex
      },
      role: item.role
    }));
  }, [rawMembers]);

  // Hook handles filtering based on Layout's search state
  const processedData = useDataFilter(data, { searchQuery, sortBy, sortDirection }, { 
      searchKeys: ['name'],
      sortStrategies: { 'Name': (a, b) => a.name.localeCompare(b.name) }
  });

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const currentItems = processedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Tray 
        pos='col-start-2' size='col-span-10' variant='grid'
        title={
          <div className="flex items-center justify-between w-full border-b border-gray-100 pb-4 mb-2 animate-fadeIn">
            <div className="flex items-center gap-2">
                <Compass className="text-primary-accent" size={24} />
                <h2 className="text-2xl font-bold font-outfit text-primary-accent">
                    Club Members
                </h2>
            </div>
            <Button variant="ghost" onClick={refreshDirectory}>
                <RefreshCcw size={18} />
            </Button>
          </div>
        }
      >
        {currentItems.length > 0 ? (
          currentItems.map((item, idx) => (
            <div key={idx} className="w-full h-full animate-fadeIn">
                <CardUser 
                    user={item.raw} 
                    role={item.role} 
                    onAction={() => navigate(`/profile/${item.raw.userId}`)}
                />
            </div>
          ))
        ) : <div className="col-span-full text-center py-10 text-gray-400">No members found.</div>}
      </Tray>

      {processedData.length > ITEMS_PER_PAGE && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
};

export default DirectoryMembers;