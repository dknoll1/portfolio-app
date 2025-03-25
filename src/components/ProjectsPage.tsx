// src/components/ProjectsPage.tsx
import React from 'react';
import FeaturedProjects from './FeaturedProjects';
import ProjectsList from './ProjectsList';

const ProjectsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">My Portfolio</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to my project portfolio. Here you'll find a collection of my work, 
          showcasing my skills and experience in software development.
        </p>
      </header>

      <FeaturedProjects />
      
      <section>
        <h2 className="text-2xl font-bold mb-6">All Projects</h2>
        <ProjectsList />
      </section>
    </div>
  );
};

export default ProjectsPage; 