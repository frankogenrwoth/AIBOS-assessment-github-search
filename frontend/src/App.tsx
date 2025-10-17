import { useEffect, useState } from 'react'
import './App.css'
import type { Repository } from './types';
import RepositoriesList from './components/RepositoriesList';

function App() {
  const [count, setCount] = useState(0);

  const [repositories, setRepositories] = useState<Repository[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/repositories', {credentials: 'include'})
      .then((response) => response.json())
      .then((data) => { setRepositories(data); setCount(data.length) })
      .catch((error) => console.error('Error fetching repositories:', error))
  }, []);

  return (
      <div className="wrapper">
        <div className="header">
          <div className="search">
            <div className="search-box">
              <input type="text" placeholder="Search repositories..." />
              <button>Search</button>
            </div>
            
          </div>

          <div className="action">
            <div className="sort">
              <label htmlFor="sort-by">Sort by:</label>
              <select className="form-control select-wrapper" id="sort-by" defaultValue="best" aria-label="Sort repositories">
                <option value="best">Best match</option>
                <option value="stars">Most stars</option>
              </select>
            </div>
            <div className="pagination-size">
              <label htmlFor="per-page">Per page:</label>
              <input
              id="per-page"
              type="number"
              className='form-control'
              min={1}
              max={100}
              step={1}
              defaultValue={20}
              aria-label="Repositories per page"
              />
            </div>
          </div>
        </div>

        <div className="search-result">
        <div className="result-count">{count} results found in <span className="search-time">"your search term"</span></div>            
        </div>

        <div className="container">
          <RepositoriesList repositories={repositories} />
        </div>

        <div className="pagination">
          <div className="pagination-controls">
            <button className="prev" disabled>Previous</button>
            <button className="next" disabled>Next</button>
          </div>

          <div className="pagination-info">
            Page <span className="current-page">1</span> of <span className="total-pages">1</span>
          </div>
        </div>
      </div>
  )
}

export default App
