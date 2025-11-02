import { useEffect, useState } from 'react';

interface Discussion {
  title: string;
  author: string;
  url: string;
  createdAt: string;
  category: string;
}

export default function Discussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const base = import.meta.env.BASE_URL || '';
        const response = await fetch(`${base}/data/discussions.json`);
        if (!response.ok) {
          throw new Error('Failed to load discussions');
        }
        const data = await response.json();
        setDiscussions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const filteredDiscussions = discussions.filter(
    (discussion) =>
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-24 w-full"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading discussions: {error}</span>
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <div className="hero min-h-[50vh] bg-base-200 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto mb-4 text-base-content/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h2 className="text-3xl font-bold mb-4">No Discussions Yet</h2>
            <p className="mb-6">
              Be the first to start a conversation! Share your ideas, ask questions, or discuss CTF strategies with the community.
            </p>
            <a
              href="https://github.com/cywf/ctf-kit/discussions/new"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Start a Discussion
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search discussions..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Discussions List */}
      {filteredDiscussions.length === 0 ? (
        <div className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>No discussions match your search.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion, index) => (
            <div key={index} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="card-title text-xl mb-2">
                      <a
                        href={discussion.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-hover"
                      >
                        {discussion.title}
                      </a>
                    </h2>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-base-content/70">
                      <span className="badge badge-outline">{discussion.category}</span>
                      <span>by {discussion.author}</span>
                      <span>•</span>
                      <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <a
                    href={discussion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost"
                    aria-label="View discussion"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
