import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import type { Repository } from './types';

function App() {
  const [count, setCount] = useState(0);

  const [repositories, setRepositories] = useState<Repository[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/repositories', {credentials: 'include'})
      .then((response) => response.json())
      .then((data) => setRepositories(data))
      .catch((error) => console.error('Error fetching repositories:', error))
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      {repositories.length > 0 ? (
        <div>
          <h2>Repositories:</h2>
          <ul>
            {repositories.map((repo) => (
              <li key={repo?.id}>
                <h3>{repo?.name}</h3>
                <p>{repo?.description}</p>
                <a href={repo?.url} target="_blank" rel="noopener noreferrer">
                  Visit Repository
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading repositories...</p>
      )}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
