import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagram {
  name: string;
  path: string;
  content: string;
}

interface MermaidViewerProps {
  diagrams: MermaidDiagram[];
}

export default function MermaidViewer({ diagrams }: MermaidViewerProps) {
  const [selectedDiagram, setSelectedDiagram] = useState<string>(diagrams[0]?.name || '');
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0f0f0f',
        primaryColor: '#00ffff',
        primaryTextColor: '#fff',
        primaryBorderColor: '#00ffff',
        lineColor: '#00ffff',
        secondaryColor: '#ff00ff',
        tertiaryColor: '#00ff00',
        fontSize: '16px',
      },
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !selectedDiagram) return;

    const renderDiagram = async () => {
      try {
        setError(null);
        const diagram = diagrams.find((d) => d.name === selectedDiagram);
        if (!diagram) {
          setError('Diagram not found');
          return;
        }

        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagram.content);
        container.innerHTML = svg;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        console.error('Mermaid render error:', err);
      }
    };

    renderDiagram();
  }, [selectedDiagram, diagrams]);

  if (diagrams.length === 0) {
    return (
      <div className="hero min-h-[60vh] bg-base-200 rounded-lg">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h2 className="text-3xl font-bold mb-4">No Diagrams Yet</h2>
            <p className="mb-6">
              Add Mermaid diagrams to visualize your project architecture, workflows, and more. Create <code className="bg-base-300 px-2 py-1 rounded">.mmd</code> files in the <code className="bg-base-300 px-2 py-1 rounded">/mermaid/</code> directory.
            </p>
            <div className="space-y-4 text-left">
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div className="text-sm">
                  <div className="font-bold">How to add diagrams:</div>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Create a <code className="bg-base-300 px-1 rounded">.mmd</code> file in <code className="bg-base-300 px-1 rounded">/mermaid/</code></li>
                    <li>Write your Mermaid diagram syntax</li>
                    <li>Commit and push your changes</li>
                    <li>The CI will automatically process it</li>
                  </ol>
                </div>
              </div>
              <a
                href="https://mermaid.js.org/intro/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                Learn Mermaid Syntax
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagram Selector */}
      <div className="flex flex-wrap gap-2">
        {diagrams.map((diagram) => (
          <button
            key={diagram.name}
            onClick={() => setSelectedDiagram(diagram.name)}
            className={`btn ${selectedDiagram === diagram.name ? 'btn-primary' : 'btn-ghost'}`}
          >
            {diagram.name}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error rendering diagram: {error}</span>
        </div>
      )}

      {/* Diagram Display */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div ref={containerRef} className="mermaid-container overflow-x-auto flex justify-center items-center min-h-[400px]" />
        </div>
      </div>
    </div>
  );
}
