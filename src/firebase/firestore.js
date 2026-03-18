import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

export function writeLog(action, col, title, adminEmail) {
  return addDoc(collection(db, "logs"), {
    action,
    collection: col,
    title,
    adminEmail,
    timestamp: serverTimestamp()
  });
}

export function subscribeToCollection(col, field, callback) {
  const q = query(collection(db, col), orderBy(field, "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addEvent(data, adminEmail) {
  const ref = await addDoc(collection(db, "events"), {
    ...data,
    createdAt: serverTimestamp()
  });
  await writeLog("ADDED", "events", data.title, adminEmail);
  return ref;
}

export async function deleteEvent(id, title, adminEmail) {
  await deleteDoc(doc(db, "events", id));
  await writeLog("DELETED", "events", title, adminEmail);
}

export async function addBlog(data, adminEmail) {
  const ref = await addDoc(collection(db, "blogs"), {
    ...data,
    createdAt: serverTimestamp()
  });
  await writeLog("ADDED", "blogs", data.title, adminEmail);
  return ref;
}

export async function deleteBlog(id, title, adminEmail) {
  await deleteDoc(doc(db, "blogs", id));
  await writeLog("DELETED", "blogs", title, adminEmail);
}

export async function addGalleryItem(data, adminEmail) {
  const ref = await addDoc(collection(db, "gallery"), {
    ...data,
    createdAt: serverTimestamp()
  });
  await writeLog("ADDED", "gallery", data.name, adminEmail);
  return ref;
}

export async function deleteGalleryItem(id, name, adminEmail) {
  await deleteDoc(doc(db, "gallery", id));
  await writeLog("DELETED", "gallery", name, adminEmail);
}
