import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project, projectAPI } from '../api/client';
import { TECH_CATEGORIES, PACKAGE_CATEGORIES, TechCategory, TechOption } from '../data/techStackData';

interface ContextType {
  selectedProject: Project | null;
  onProjectRefresh: () => Promise<void>;
}

const RoadmapPage: React.FC = () => {
  const { selectedProject, onProjectRefresh } = useOutletContext<ContextType>();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPackageCategory, setSelectedPackageCategory] = useState<string>('');
  const [error, setError] = useState('');

  const handleAddTechnology = async (category: string, tech: TechOption) => {
    if (!selectedProject) return;

    try {
      await projectAPI.addTechnology(selectedProject.id, {
        category: category as any,
        name: tech.name,
        version: tech.latestVersion || ''
      });
      await onProjectRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add technology');
    }
  };

  const handleRemoveTechnology = async (category: string, name: string) => {
    if (!selectedProject) return;

    try {
      await projectAPI.removeTechnology(selectedProject.id, category, name);
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to remove technology');
    }
  };

  const handleAddPackage = async (category: string, pkg: TechOption) => {
    if (!selectedProject) return;

    try {
      await projectAPI.addPackage(selectedProject.id, {
        category: category as any,
        name: pkg.name,
        version: pkg.latestVersion || '',
        description: pkg.description
      });
      await onProjectRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add package');
    }
  };

  const handleRemovePackage = async (category: string, name: string) => {
    if (!selectedProject) return;

    try {
      await projectAPI.removePackage(selectedProject.id, category, name);
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to remove package');
    }
  };

  const isSelected = (category: string, name: string, type: 'tech' | 'package') => {
    if (!selectedProject) return false;
    
    if (type === 'tech') {
      return selectedProject.selectedTechnologies.some(
        tech => tech.category === category && tech.name === name
      );
    } else {
      return selectedProject.selectedPackages.some(
        pkg => pkg.category === category && pkg.name === name
      );
    }
  };

  const TechSelector: React.FC<{
    categories: TechCategory[];
    type: 'tech' | 'package';
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
  }> = ({ categories, type, selectedCategory, onCategoryChange }) => (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(selectedCategory === category.id ? '' : category.id)}
            className={`btn btn-sm gap-2 ${
              selectedCategory === category.id 
                ? 'btn-primary' 
                : 'btn-outline'
            }`}
            style={{
              borderColor: selectedCategory === category.id ? category.color : undefined,
              backgroundColor: selectedCategory === category.id ? category.color : undefined
            }}
          >
            <span className="text-lg">{category.emoji}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Tech Options */}
      {selectedCategory && (
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            {(() => {
              const category = categories.find(c => c.id === selectedCategory);
              if (!category) return null;

              return (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{category.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-base-content/60">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.options.map((option) => {
                      const selected = isSelected(category.id, option.name, type);
                      return (
                        <div
                          key={option.name}
                          className={`card bg-base-100 shadow-sm border-2 transition-all cursor-pointer ${
                            selected 
                              ? 'border-primary bg-primary/10' 
                              : 'border-base-300 hover:border-primary/50'
                          }`}
                          onClick={() => {
                            if (selected) {
                              type === 'tech' 
                                ? handleRemoveTechnology(category.id, option.name)
                                : handleRemovePackage(category.id, option.name);
                            } else {
                              type === 'tech'
                                ? handleAddTechnology(category.id, option)
                                : handleAddPackage(category.id, option);
                            }
                          }}
                        >
                          <div className="card-body p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{option.name}</h4>
                                <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
                                  {option.description}
                                </p>
                                {option.latestVersion && (
                                  <div className="badge badge-xs badge-ghost mt-2">
                                    v{option.latestVersion}
                                  </div>
                                )}
                              </div>
                              <div className="ml-2">
                                {selected ? (
                                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">Select a project</h2>
          <p className="text-base-content/60">Choose a project from the sidebar to view tech stack and progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">

      {error && (
        <div className="alert alert-error">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError('')} className="btn btn-ghost btn-sm">×</button>
        </div>
      )}

      {/* Selected Technologies Display */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          🔧 Selected Stack ({selectedProject.selectedTechnologies?.length || 0})
        </div>
        <div className="collapse-content">
          {selectedProject.selectedTechnologies?.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔧</div>
              <p className="text-base-content/60">No technologies selected yet. Choose from the categories below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TECH_CATEGORIES.map((category) => {
                const selectedInCategory = selectedProject.selectedTechnologies.filter(
                  tech => tech.category === category.id
                );
                if (selectedInCategory.length === 0) return null;

                return (
                  <div key={category.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{category.emoji}</span>
                        <h3 className="font-semibold">{category.name}</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedInCategory.map((tech) => (
                          <div key={tech.name} className="flex items-center justify-between p-2 bg-base-100 rounded border">
                            <div>
                              <span className="font-medium">{tech.name}</span>
                              {tech.version && (
                                <span className="text-xs text-base-content/60 ml-2">v{tech.version}</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveTechnology(tech.category, tech.name)}
                              className="btn btn-ghost btn-xs text-error"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Technology Selection */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          🛠️ Add Technologies
        </div>
        <div className="collapse-content">
          <TechSelector
            categories={TECH_CATEGORIES}
            type="tech"
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Package Selection */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          📦 Add Packages ({selectedProject.selectedPackages?.length || 0} selected)
        </div>
        <div className="collapse-content">
          <TechSelector
            categories={PACKAGE_CATEGORIES}
            type="package"
            selectedCategory={selectedPackageCategory}
            onCategoryChange={setSelectedPackageCategory}
          />
        </div>
      </div>

      {/* Project Statistics */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          📊 Project Statistics
        </div>
        <div className="collapse-content">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="stat-title">Technologies</div>
              <div className="stat-value text-primary">{selectedProject.selectedTechnologies?.length || 0}</div>
              <div className="stat-desc">Core technologies selected</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="stat-title">Packages</div>
              <div className="stat-value text-secondary">{selectedProject.selectedPackages?.length || 0}</div>
              <div className="stat-desc">NPM packages added</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-title">Active Tasks</div>
              <div className="stat-value text-accent">
                {selectedProject.todos?.filter(todo => !todo.completed).length || 0}
              </div>
              <div className="stat-desc">
                {selectedProject.todos?.filter(todo => todo.completed).length || 0} completed
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-info">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="stat-title">Documentation</div>
              <div className="stat-value text-info">{selectedProject.docs?.length || 0}</div>
              <div className="stat-desc">Templates created</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;