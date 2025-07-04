import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
}

const RoadmapPage: React.FC = () => {
  const { selectedProject } = useOutletContext<ContextType>();

  if (!selectedProject) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: '#6b7280'
      }}>
        Select a project to view roadmap
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        {selectedProject.name} - Roadmap
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        border: '1px solid #e5e7eb',
        padding: '1.5rem'
      }}>
        <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>Development Roadmap</h2>
        <div style={{ 
          whiteSpace: 'pre-wrap', 
          color: '#374151',
          lineHeight: '1.6'
        }}>
          {selectedProject.roadmap || 'No roadmap defined yet...'}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;