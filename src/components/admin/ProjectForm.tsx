import React, { useState, useEffect } from 'react';
import { Project } from '../../types/project';
import { addProject, updateProject, getProjectById } from '../../services/projectService';

interface ProjectFormProps {
  projectId?: string;
  onSuccess: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const project = await getProjectById(projectId);
        
        if (project) {
          setTitle(project.title);
          setDescription(project.description);
          setImageUrl(project.imageUrl || '');
          setTechnologies(project.technologies);
          setGithubUrl(project.githubUrl || '');
          setLiveUrl(project.liveUrl || '');
          setFeatured(project.featured);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const projectData = {
        title,
        description,
        imageUrl: imageUrl || undefined,
        technologies,
        githubUrl: githubUrl || undefined,
        liveUrl: liveUrl || undefined,
        featured
      };
      
      if (projectId) {
        await updateProject(projectId, projectData);
      } else {
        await addProject(projectData as Omit<Project, 'id' | 'createdAt'>);
      }
      
      onSuccess();
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technologies *
        </label>
        <div className="flex mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add a technology"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addTechnology}
            className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <div key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
              {tech}
              <button
                type="button"
                onClick={() => removeTechnology(index)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        {technologies.length === 0 && (
          <p className="text-sm text-red-500 mt-1">Add at least one technology</p>
        )}
      </div>
      
      <div>
        <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
          GitHub URL
        </label>
        <input
          type="url"
          id="githubUrl"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700">
          Live URL
        </label>
        <input
          type="url"
          id="liveUrl"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex items-center">
        <input
          id="featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
          Featured project
        </label>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={loading || technologies.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : projectId ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm; 