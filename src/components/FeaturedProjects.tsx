import React, { useEffect, useState } from 'react';
import { Project } from '../types/project';
import ProjectCard from './ProjectCard';
import { getFeaturedProjects } from '../services/projectService';

const FeaturedProjects: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const projects = await getFeaturedProjects();
        setFeaturedProjects(projects);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured projects:', err);
        setError('Failed to load featured projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading featured projects...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-red-500">{error}</div>;
  }

  if (featuredProjects.length === 0) {
    return null; // Don't show anything if no featured projects
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects; 