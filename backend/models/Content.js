const db = require('../config/db');

class Content {
  static async getDocuments() {
    const [results] = await db.query('CALL get_documents_view()');
    return results[0];
  }

  static async getNotifications() {
    const [results] = await db.query('CALL get_notifications_view()');
    return results[0];
  }

  static async create(type, { title, content, docType, authorId }) {
    if (type === 'DOCUMENT') {
      return db.query(
        'INSERT INTO documents (title, type, author_id) VALUES (?, ?, ?)', 
        [title, docType || 'BCN_BYLAW', authorId]
      );
    } else {
      return db.query(
        'INSERT INTO notifications (title, content, author_id) VALUES (?, ?, ?)', 
        [title, content, authorId]
      );
    }
  }
}

module.exports = Content;