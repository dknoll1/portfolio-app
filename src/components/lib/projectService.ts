// Cursor/portfolio-app/src/lib/projectService.ts
// Provides functions to interact with the projects collection in Firestore

import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Define the Project interface for type safety
export interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  createdAt: Date;
}

// Reference to the projects collection
const projectsCollection = collection(db, "projects");

// Add a new project to Firestore
export const addProject = async (project: Omit<Project, "id" | "createdAt">) => {
  try {
    const projectWithTimestamp = {
      ...project,
      createdAt: new Date(),
    };
    const docRef = await addDoc(projectsCollection, projectWithTimestamp);
    return { id: docRef.id, ...projectWithTimestamp };
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// Fetch all projects from Firestore
export const getProjects = async (): Promise<Project[]> => {
  try {
    const querySnapshot = await getDocs(projectsCollection);
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    return projects;
  } catch (error) {
    console.log(collection(db, "projects"));
    console.error("Error fetching projects:", error);
    throw error;
  }
}; 