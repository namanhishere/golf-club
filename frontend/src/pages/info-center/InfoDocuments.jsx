import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Layers, RefreshCcw } from 'lucide-react';
import { Tray, CardDocument, Button } from '@/components';

const InfoDocuments = () => {
  // Get raw data and refresh function from Layout context
  const { rawDocs, refreshInfo } = useOutletContext();

  // Format data for the Card component
  const items = useMemo(() => {
    return rawDocs.map(item => ({
      raw: {
        documentId: item.document_id,
        title: item.title,
        type: item.type, 
        createdAt: item.created_at
      },
      authorName: item.author_name
    }));
  }, [rawDocs]);

  return (
  <Tray 
    pos="col-start-2" size="col-span-10" variant="grid" 
    title={
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100 w-full animate-fadeIn">
        <div className="flex items-center gap-2">
          <Layers className="text-primary-accent" />
          <h2 className="text-2xl font-bold font-outfit text-primary-accent">
            Documents
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
          <CardDocument 
            doc={item.raw} 
            authorName={item.authorName}
            onAction={() => alert(`View doc ${item.raw.documentId}`)} 
          />
        </div>
      ))
    ) : <div className="col-span-full text-center text-gray-400">No documents available.</div>}
  </Tray>
  );
};

export default InfoDocuments;