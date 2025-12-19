import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Trophy, List, CheckCircle, XCircle, Flag, User, Clock } from 'lucide-react';

import { useAuth } from '../context';
import { api } from '../services';
import { formatDateTimeRange } from '../utils';
import { Tray, Button, ViewToggle, Loading } from '../components';

// --- SUB-COMPONENT: Participant Card ---
const ParticipantCard = ({ participant, currentUser, isAdmin, isPending, onApprove, onReject }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
    participant.user_id === currentUser.id 
    ? 'bg-blue-50 border-blue-200 shadow-sm' 
    : 'bg-white border-gray-100 hover:shadow-md'
  }`}>
    <div className="flex items-center gap-4">
      <div className="relative">
        <img src={participant.profile_pic_url || 'default.png'} alt="avatar" className="w-12 h-12 rounded-full bg-gray-200 object-cover border border-gray-100" />
        {participant.user_id === currentUser.id && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-lg text-txt-primary flex items-center gap-2">
          {participant.first_name} {participant.last_name}
        </div>
        <div className="flex items-center gap-3 text-sm text-secondary-accent font-medium">
          <span className="flex items-center gap-1"><User size={12}/> VGA: {participant.vga_number || 'N/A'}</span>
          <span className="flex items-center gap-1 text-gray-400">•</span>
          <span>{new Date(participant.registered_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>

    {isAdmin && isPending && (
      <div className="flex gap-2">
        <Button variant="ghost" className="text-green-600 hover:bg-green-50 p-2" onClick={onApprove}><CheckCircle size={22} /></Button>
        <Button variant="ghost" className="text-red-600 hover:bg-red-50 p-2" onClick={onReject}><XCircle size={22} /></Button>
      </div>
    )}
  </div>
);

// --- SUB-COMPONENT: Info Box ---
const InfoBox = ({ label, value, icon: Icon }) => (
  <div className="p-4 rounded-xl bg-white border border-gray-100 flex flex-col shadow-sm">
    <div className="flex items-center gap-2 text-secondary-accent text-xs font-bold uppercase mb-2 tracking-wider">
      <Icon size={14} /> {label}
    </div>
    <div className="text-xl font-extrabold text-txt-primary truncate">{value}</div>
  </div>
);

const TournamentDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('detail');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const fetchDetails = async () => {
  try {
    const json = await api.get(`/tournaments/${id}`, token);
    setData(json);
  } catch (err) { console.error(err); } 
  finally { setLoading(false); }
  };

  useEffect(() => { fetchDetails(); }, [id, token]);

  const handleStatusChange = async (userId, newStatus) => {
  try {
    await api.post('/tournaments/manage', { tournamentId: id, targetUserId: userId, status: newStatus }, token);
    fetchDetails(); 
  } catch (err) { alert('Action failed'); }
  };

  const handleRegister = async () => {
  if (!window.confirm("Confirm registration for this event?")) return;
  setRegistering(true);
  try {
    await api.post('/tournaments/register', { tournamentId: id }, token);
    alert("Registration successful! Your status is now PENDING.");
    fetchDetails(); 
  } catch (error) {
    alert(`Registration failed: ${error.message}`);
  } finally {
    setRegistering(false);
  }
  };

  if (loading) return <Loading />;
  if (!data) return <div>Not found</div>;

  const { details, participants } = data;
  const isAdmin = user?.role === 'ADMIN';
  const approvedParticipants = participants.filter(p => p.status === 'APPROVED');
  const pendingParticipants = participants.filter(p => p.status === 'PENDING');
  const userRegistration = participants.find(p => p.user_id === user.id);
  const isRegistered = !!userRegistration;
  const isUpcoming = details.status === 'UPCOMING';

  return (
  <>
    <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center'>
      <div className='font-outfit text-primary-accent text-5xl font-extrabold text-center'>{details.name}</div>
      
      <div className='flex flex-wrap justify-center gap-4 mt-4 text-secondary-accent font-medium'>
        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
          <MapPin size={18} className="text-primary-accent"/> {details.location}
        </span>
        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
          <Clock size={18} className="text-primary-accent"/> 
          {formatDateTimeRange(details.start_date, details.end_date)}
        </span>
      </div>
      
      <div className="mt-8">
        <ViewToggle options={[{ id: 'detail', label: 'Details', icon: List }, { id: 'participants', label: 'Participants', icon: Users }]} activeId={activeTab} onToggle={setActiveTab} />
      </div>
    </div>

    <div className='col-start-2 col-span-10 p-8 pb-4'>
      <Button variant='ghost' onClick={() => navigate('/tournaments')}>← Back to List</Button>
    </div>

    <Tray pos="col-start-3" size="col-span-8" variant="flex">
      {activeTab === 'detail' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          <div className="col-span-12 md:col-span-4">
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-md bg-white p-2">
              <img src={details.image_url || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800'} alt={details.name} className="w-full h-auto object-cover rounded-lg aspect-3/4"/>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
            <div className="bg-surface p-6 rounded-xl border border-gray-100 h-full relative">
              <h3 className="text-xl font-bold font-outfit text-primary-accent mb-4 border-b border-gray-100 pb-2">About the Event</h3>
              <p className="text-txt-primary font-roboto whitespace-pre-wrap leading-relaxed mb-6">{details.description}</p>

              <div className="mt-auto border-t border-gray-100 pt-4">
                {!isRegistered ? (
                  isUpcoming ? (
                    <Button onClick={handleRegister} isLoading={registering} className="w-full flex items-center justify-center gap-2"><Flag size={18} /> Register Now</Button>
                  ) : (
                    <div className="p-3 text-center bg-gray-100 text-gray-500 rounded-lg font-bold">Registration Closed</div>
                  )
                ) : (
                  <div className={`p-3 text-center rounded-lg font-bold border ${userRegistration.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : userRegistration.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>Registration Status: {userRegistration.status}</div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoBox label="Format" value={details.format || 'Stroke Play'} icon={Trophy} />
              <InfoBox label="Entry Fee" value={`$${details.entry_fee}`} icon={DollarSign} />
              <InfoBox label="Capacity" value={`${details.current_participants} / ${details.max_participants}`} icon={Users} />
              <InfoBox label="Organizer" value={details.creator_name} icon={Users} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="w-full flex flex-col gap-8">
          {isAdmin && pendingParticipants.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold font-outfit text-orange-600 border-b border-orange-100 pb-2 flex items-center gap-2"><Flag size={20}/> Pending Applications ({pendingParticipants.length})</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingParticipants.map((p) => (
                  <ParticipantCard key={p.user_id} participant={p} currentUser={user} isAdmin={true} isPending={true} onApprove={() => handleStatusChange(p.user_id, 'APPROVED')} onReject={() => handleStatusChange(p.user_id, 'REJECTED')} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold font-outfit text-primary-accent border-b border-gray-100 pb-2 flex items-center gap-2"><Users size={20}/> Official Roster ({approvedParticipants.length})</h3>
            {approvedParticipants.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {approvedParticipants.map((p) => (
                  <ParticipantCard key={p.user_id} participant={p} currentUser={user} isAdmin={isAdmin} isPending={false} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12 italic border-2 border-dashed border-gray-100 rounded-xl">No confirmed participants yet.</div>
            )}
          </div>
        </div>
      )}
    </Tray>
  </>
  );
};

export default TournamentDetail;