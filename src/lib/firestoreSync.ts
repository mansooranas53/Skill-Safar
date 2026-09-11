import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import firebaseConfig from '../../firebase-applet-config.json';

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  type: 'UPLOAD' | 'DOWNLOAD' | 'REALTIME' | 'PING' | 'ERROR';
  collection: string;
  message: string;
  count?: number;
}

export interface CloudDatabaseStatus {
  isConfigured: boolean;
  isConnected: boolean;
  isSyncing: boolean;
  projectId: string;
  region: string;
  databaseId: string;
  lastSyncedAt: string | null;
  latencyMs: number | null;
  error: string | null;
  counts: Record<string, number>;
  logs: SyncLogEntry[];
}

export const cloudDatabaseInfo: CloudDatabaseStatus = {
  isConfigured: isFirebaseConfigured,
  isConnected: false,
  isSyncing: false,
  projectId: firebaseConfig.projectId || 'gen-lang-client-0269283360',
  region: 'asia-south1',
  databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
  lastSyncedAt: null,
  latencyMs: null,
  error: null,
  counts: {
    students: 0,
    opportunities: 0,
    companies: 0,
    institutions: 0,
    applications: 0,
    mentors: 0,
    collaborations: 0,
    learningPrograms: 0,
    auditLogs: 0
  },
  logs: []
};

const MAX_LOGS = 30;

function addLog(
  type: SyncLogEntry['type'],
  collectionName: string,
  message: string,
  count?: number
) {
  const entry: SyncLogEntry = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    type,
    collection: collectionName,
    message,
    count
  };
  cloudDatabaseInfo.logs = [entry, ...cloudDatabaseInfo.logs.slice(0, MAX_LOGS - 1)];
}

/**
 * Test connectivity with Cloud Firestore and measure round-trip latency
 */
export async function verifyCloudDatabaseConnection(): Promise<boolean> {
  if (!isFirebaseConfigured) {
    cloudDatabaseInfo.error = 'Firebase configuration missing';
    return false;
  }

  const startTime = Date.now();
  try {
    const healthRef = doc(db, 'system_meta', 'health');
    await setDoc(
      healthRef,
      {
        lastPing: new Date().toISOString(),
        region: 'asia-south1',
        projectId: firebaseConfig.projectId,
        databaseId: firebaseConfig.firestoreDatabaseId,
        status: 'OPERATIONAL'
      },
      { merge: true }
    );
    const latency = Date.now() - startTime;
    cloudDatabaseInfo.isConnected = true;
    cloudDatabaseInfo.latencyMs = latency;
    cloudDatabaseInfo.lastSyncedAt = new Date().toLocaleTimeString();
    cloudDatabaseInfo.error = null;
    addLog('PING', 'system_meta', `Cloud database operational (${latency}ms)`);
    return true;
  } catch (err) {
    const msg = (err as Error).message || 'Failed to connect';
    console.warn('Cloud database connection verification error:', err);
    cloudDatabaseInfo.isConnected = false;
    cloudDatabaseInfo.error = msg;
    addLog('ERROR', 'system_meta', `Connection failed: ${msg}`);
    return false;
  }
}

/**
 * Synchronize an individual entity document into Cloud Firestore
 */
export async function syncDocToFirestore(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    cloudDatabaseInfo.isConnected = true;
    cloudDatabaseInfo.lastSyncedAt = new Date().toLocaleTimeString();
    if (cloudDatabaseInfo.counts[collectionName] !== undefined) {
      cloudDatabaseInfo.counts[collectionName] = Math.max(
        1,
        cloudDatabaseInfo.counts[collectionName] + 1
      );
    }
  } catch (err) {
    console.warn(`Firestore sync error on ${collectionName}/${docId}:`, err);
    addLog('ERROR', collectionName, `Sync failed for doc ${docId}: ${(err as Error).message}`);
  }
}

/**
 * Delete an entity document from Cloud Firestore
 */
export async function deleteDocFromFirestore(
  collectionName: string,
  docId: string
): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    addLog('UPLOAD', collectionName, `Deleted document ${docId}`);
  } catch (err) {
    console.warn(`Firestore delete error on ${collectionName}/${docId}:`, err);
  }
}

/**
 * Fetch all items in a collection from Cloud Firestore
 */
export async function fetchCollectionFromFirestore<T>(collectionName: string): Promise<T[]> {
  if (!isFirebaseConfigured) return [];
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: T[] = [];
    querySnapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
    });
    cloudDatabaseInfo.counts[collectionName] = items.length;
    addLog('DOWNLOAD', collectionName, `Loaded ${items.length} records from Firestore`, items.length);
    return items;
  } catch (err) {
    console.warn(`Error fetching ${collectionName} from Firestore:`, err);
    addLog('ERROR', collectionName, `Fetch failed: ${(err as Error).message}`);
    return [];
  }
}

/**
 * Push an entire dataset snapshot to Cloud Firestore in batches
 */
export async function pushAllToFirestore(payload: {
  institutions?: unknown[];
  companies?: unknown[];
  opportunities?: unknown[];
  managedStudents?: unknown[];
  managedMentors?: unknown[];
  applications?: unknown[];
  collaborations?: unknown[];
  learningPrograms?: unknown[];
  auditLogs?: unknown[];
  notifications?: unknown[];
  users?: unknown[];
  student?: unknown;
}): Promise<{ success: boolean; totalUploaded: number; error?: string }> {
  if (!isFirebaseConfigured) {
    return { success: false, totalUploaded: 0, error: 'Firebase not configured' };
  }

  cloudDatabaseInfo.isSyncing = true;
  let totalUploaded = 0;

  try {
    const collectionsToSync: Array<{ name: string; items: any[] }> = [
      { name: 'institutions', items: (payload.institutions as any[]) || [] },
      { name: 'companies', items: (payload.companies as any[]) || [] },
      { name: 'opportunities', items: (payload.opportunities as any[]) || [] },
      { name: 'students', items: (payload.managedStudents as any[]) || [] },
      { name: 'mentors', items: (payload.managedMentors as any[]) || [] },
      { name: 'applications', items: (payload.applications as any[]) || [] },
      { name: 'collaborations', items: (payload.collaborations as any[]) || [] },
      { name: 'learningPrograms', items: (payload.learningPrograms as any[]) || [] },
      { name: 'notifications', items: (payload.notifications as any[]) || [] },
      { name: 'users', items: (payload.users as any[]) || [] },
      { name: 'auditLogs', items: (payload.auditLogs as any[]) || [] }
    ];

    for (const group of collectionsToSync) {
      if (!group.items.length) continue;
      for (const item of group.items) {
        if (!item?.id) continue;
        const ref = doc(db, group.name, String(item.id));
        await setDoc(ref, item, { merge: true });
        totalUploaded++;
      }
      cloudDatabaseInfo.counts[group.name] = group.items.length;
      addLog('UPLOAD', group.name, `Synced ${group.items.length} items to cloud`, group.items.length);
    }

    // Sync primary student profile
    if (payload.student && (payload.student as any).id) {
      const studentRef = doc(db, 'studentProfiles', (payload.student as any).id);
      await setDoc(studentRef, payload.student as any, { merge: true });
      totalUploaded++;
      addLog('UPLOAD', 'studentProfiles', 'Synced primary student profile');
    }

    cloudDatabaseInfo.isConnected = true;
    cloudDatabaseInfo.lastSyncedAt = new Date().toLocaleTimeString();
    cloudDatabaseInfo.error = null;
    return { success: true, totalUploaded };
  } catch (err) {
    const msg = (err as Error).message || 'Sync failed';
    cloudDatabaseInfo.error = msg;
    addLog('ERROR', 'all', `Batch sync error: ${msg}`);
    return { success: false, totalUploaded, error: msg };
  } finally {
    cloudDatabaseInfo.isSyncing = false;
  }
}

/**
 * Setup Realtime Cloud Sync Listeners for specified collections
 */
export function setupRealtimeSync(
  collectionName: string,
  onDataChange: (docs: any[]) => void
): () => void {
  if (!isFirebaseConfigured) return () => {};

  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      snapshot => {
        const items: any[] = [];
        snapshot.forEach(docSnap => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        cloudDatabaseInfo.counts[collectionName] = items.length;
        cloudDatabaseInfo.lastSyncedAt = new Date().toLocaleTimeString();
        cloudDatabaseInfo.isConnected = true;
        addLog('REALTIME', collectionName, `Realtime update: ${items.length} docs`, items.length);
        onDataChange(items);
      },
      error => {
        console.warn(`Realtime sync listener error for ${collectionName}:`, error);
        addLog('ERROR', collectionName, `Realtime listener error: ${error.message}`);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn(`Failed to attach realtime sync for ${collectionName}:`, err);
    return () => {};
  }
}

/**
 * Export complete local/cloud dataset as a structured JSON object
 */
export function exportExternalDatabaseSnapshot(data: Record<string, unknown>): string {
  const exportPayload = {
    meta: {
      exportedAt: new Date().toISOString(),
      platform: 'Skill Safar Collaboration Platform',
      firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
      projectId: firebaseConfig.projectId,
      version: '2.4.0'
    },
    database: data
  };
  return JSON.stringify(exportPayload, null, 2);
}

