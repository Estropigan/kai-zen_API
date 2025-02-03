import { db } from '../config/firebase.js';

/**
 * Creates or updates a document in Firestore.
 * @param {string} collection - Firestore collection name.
 * @param {string} docId - Document ID.
 * @param {object} data - Data to store.
 */
export const setDocument = async (collection, docId, data) => {
  try {
    await db.collection(collection).doc(docId).set(data, { merge: true });
    return { id: docId, ...data };
  } catch (error) {
    throw new Error(`Error setting document in ${collection}: ${error.message}`);
  }
};

/**
 * Retrieves a document from Firestore.
 * @param {string} collection - Firestore collection name.
 * @param {string} docId - Document ID.
 * @returns {Promise<object|null>} - Document data or null if not found.
 */
export const getDocument = async (collection, docId) => {
  try {
    const doc = await db.collection(collection).doc(docId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    throw new Error(`Error retrieving document from ${collection}: ${error.message}`);
  }
};

export const getCollection = async (collection) => {
  const snapshot = await db.collection(collection).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update a document
export const updateDocument = async (collection, docId, data) => {
  return db.collection(collection).doc(docId).update(data);
};

// Delete a document
export const deleteDocument = async (collection, docId) => {
  return db.collection(collection).doc(docId).delete();
};
