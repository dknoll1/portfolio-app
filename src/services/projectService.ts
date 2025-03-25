// src/services/projectService.ts
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Project } from '../types/project';

const projectsCollection = collection(db, 'projects');

// Convert Firestore document to Project
const convertToProject = (doc: DocumentData): Project => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    technologies: data.technologies,
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    featured: data.featured,
    createdAt: data.createdAt.toDate()
  };
};

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
  const projectsQuery = query(projectsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(projectsQuery);
  return snapshot.docs.map(convertToProject);
};

// Get featured projects
export const getFeaturedProjects = async (): Promise<Project[]> => {
  const featuredQuery = query(
    projectsCollection, 
    where('featured', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(featuredQuery);
  return snapshot.docs.map(convertToProject);
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  const docRef = doc(db, 'projects', id);
  const snapshot = await getDoc(docRef);
  
  if (snapshot.exists()) {
    return convertToProject(snapshot);
  }
  
  return null;
};

// Add a new project
export const addProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(projectsCollection, {
    ...project,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

// Update a project
export const updateProject = async (id: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<void> => {
  const docRef = doc(db, 'projects', id);
  await updateDoc(docRef, project);
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  const docRef = doc(db, 'projects', id);
  await deleteDoc(docRef);
}; 