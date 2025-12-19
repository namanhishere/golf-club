const db = require('../config/db');

// 1. Get Profile & Stats
// Procedure: get_user_full_profile(user_id)
exports.getProfile = async (req, res) => {
  try {
    const targetId = req.query.userId || req.user.id;
    
    // Returns [[row], fieldPacket]
    const [results] = await db.query('CALL get_user_full_profile(?)', [targetId]);
    const userRows = results[0]; // Extract actual data

    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
    
    // Procedure already calculates stats and determines role
    res.json(userRows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get All Users (Directory)
// Procedure: get_directory_users()
exports.getAllUsers = async (req, res) => {
  try {
    const [results] = await db.query('CALL get_directory_users()');
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Tournaments (Updated to support "My Tournaments" filter)
exports.getTournaments = async (req, res) => {
  try {
    const filter = req.query.filter; // 'all' or 'mine'
    const userId = req.user.id;
    
    let query = 'CALL get_tournaments_view(?)';
    let params = [null];

    if (filter === 'mine') {
        query = 'CALL get_my_tournaments(?)';
        params = [userId];
    }

    const [results] = await db.query(query, params);
    res.json(results[0]);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

// 3b. Create Tournament (New Enhanced Version)
exports.createTournament = async (req, res) => {
    const { 
        name, description, startDate, endDate, location, 
        maxParticipants, entryFee, format, imageUrl // <--- Extract imageUrl
    } = req.body;

    try {
        // Pass imageUrl as the last parameter
        await db.query('CALL create_tournament(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            req.user.id, name, description, startDate, endDate, 
            location, maxParticipants, entryFee, format, imageUrl
        ]);
        res.json({ message: 'Tournament created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3c. Get Tournament Specifics (Detail, Participants)
exports.getTournamentDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [details] = await db.query('CALL get_tournament_details(?)', [id]);
        const [participants] = await db.query('CALL get_tournament_participants(?)', [id]);
        
        if (!details[0] || details[0].length === 0) return res.status(404).json({ error: 'Tournament not found' });

        res.json({
            details: details[0][0],
            participants: participants[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3d. Manage Application (Approve/Deny)
exports.manageApplication = async (req, res) => {
    const { tournamentId, targetUserId, status } = req.body; // status: 'APPROVED' or 'REJECTED'
    try {
        // Optional: Check if req.user.role is ADMIN or Creator of tournament here
        if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorized' });

        await db.query('CALL manage_tournament_application(?, ?, ?, ?)', [
            req.user.id, tournamentId, targetUserId, status
        ]);
        res.json({ message: `User application ${status}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Register for Tournament
// Procedure: apply_for_tournament(tournament_id, user_id)
exports.registerTournament = async (req, res) => {
  const { tournamentId } = req.body;
  try {
    await db.query('CALL apply_for_tournament(?, ?)', [tournamentId, req.user.id]);
    res.json({ message: 'Application submitted successfully' });
  } catch (error) { 
    // SQL Error 45000 is thrown by the procedure logic (Full, Closed, etc.)
    res.status(400).json({ error: error.message }); 
  }
};

// 5. Get Documents
// Procedure: get_documents_view()
exports.getDocuments = async (req, res) => {
  try {
    const [results] = await db.query('CALL get_documents_view()');
    res.json(results[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 6. Get Notifications
// Procedure: get_notifications_view()
exports.getNotifications = async (req, res) => {
  try {
    const [results] = await db.query('CALL get_notifications_view()');
    res.json(results[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 7. Create Content (Admin Only)
// Kept as simple inserts since they don't require complex joins logic yet
exports.createContent = async (req, res) => {
  const { type, title, content, docType } = req.body; 
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admins only' });

    if (type === 'DOCUMENT') {
      await db.query(
        'INSERT INTO documents (title, type, author_id) VALUES (?, ?, ?)', 
        [title, docType || 'BCN_BYLAW', req.user.id]
      );
    } else {
      await db.query(
        'INSERT INTO notifications (title, content, author_id) VALUES (?, ?, ?)', 
        [title, content, req.user.id]
      );
    }
    res.json({ message: 'Content created successfully' });
  } catch (error) { res.status(400).json({ error: error.message }); }
};

// 8. Update Profile
// Procedure: update_user_profile(...)
exports.updateProfile = async (req, res) => {
  const { 
    firstName, lastName, phoneNumber, 
    vgaNumber, shirtSize, bio, 
    profilePicUrl, backgroundColorHex 
  } = req.body;

  try {
    const [results] = await db.query('CALL update_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      req.user.id,
      firstName,
      lastName,
      phoneNumber,
      vgaNumber || null,
      shirtSize || null,
      bio || null,
      profilePicUrl || 'default_avatar.png',
      backgroundColorHex || '#64748b'
    ]);
    
    // The procedure returns the updated user row as the first element of the first result set
    res.json(results[0][0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};