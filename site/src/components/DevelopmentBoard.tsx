import { useEffect, useState } from 'react';

interface ProjectItem {
  title: string;
  status: string;
  url: string;
  labels: string[];
  assignees: string[];
}

interface ProjectData {
  name: string;
  items: ProjectItem[];
}

export default function DevelopmentBoard() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const base = import.meta.env.BASE_URL || '';
        const response = await fetch(`${base}/data/projects.json`);
        if (!response.ok) {
          throw new Error('Failed to load project data');
        }
        const data = await response.json();
        setProjectData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-64 w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading project data: {error}</span>
      </div>
    );
  }

  // Group items by status
  const todoItems = projectData.items.filter((item) => item.status === 'Todo' || item.status === 'todo');
  const inProgressItems = projectData.items.filter((item) => item.status === 'In Progress' || item.status === 'doing');
  const doneItems = projectData.items.filter((item) => item.status === 'Done' || item.status === 'done');

  const renderColumn = (title: string, items: ProjectItem[], colorClass: string) => (
    <div className="flex flex-col gap-4">
      <div className={`card bg-base-200 shadow-xl ${colorClass}`}>
        <div className="card-body p-4">
          <h3 className="card-title text-lg">{title}</h3>
          <div className="badge badge-lg">{items.length}</div>
        </div>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="card bg-base-200 shadow">
            <div className="card-body p-4 text-center text-base-content/50">
              <p className="text-sm">No items</p>
            </div>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="card bg-base-200 shadow hover:shadow-lg transition-shadow">
              <div className="card-body p-4">
                <h4 className="font-semibold text-sm mb-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-hover"
                  >
                    {item.title}
                  </a>
                </h4>
                {item.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.labels.map((label, idx) => (
                      <span key={idx} className="badge badge-sm badge-outline">
                        {label}
                      </span>
                    ))}
                  </div>
                )}
                {item.assignees.length > 0 && (
                  <div className="flex gap-1 text-xs text-base-content/70">
                    <span>👤</span>
                    <span>{item.assignees.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">{projectData.name}</h3>
          <div className="text-xs">This is a read-only view. Visit GitHub to update items.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderColumn('📋 To Do', todoItems, 'border-l-4 border-info')}
        {renderColumn('🚧 In Progress', inProgressItems, 'border-l-4 border-warning')}
        {renderColumn('✅ Done', doneItems, 'border-l-4 border-success')}
      </div>
    </div>
  );
}
