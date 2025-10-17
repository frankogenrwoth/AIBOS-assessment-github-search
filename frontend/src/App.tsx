import { useEffect, useState } from 'react'
import './App.css'
import type { Repository } from './types';
import RepositoriesList from './components/RepositoriesList';

function App() {
  const [count, setCount] = useState(0);

  const [paginationSize, setPaginationSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const [repositories, setRepositories] = useState<Repository[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/repositories', {credentials: 'include'})
      .then((response) => response.json())
      .then((data) => { setRepositories(data); setCount(data.length) })
      .catch((error) => console.error('Error fetching repositories:', error))
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [paginationSize]);

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
              onChange={
                (event) => {
                  setPaginationSize(Number(event.target.value));
                }
              }
              />
            </div>
          </div>
        </div>

        <div className="search-result">
        <div className="result-count">{count} results found in <span className="search-time">"your search term"</span></div>            
        </div>

        <div className="container">
          <RepositoriesList repositories={repositories.slice((currentPage - 1) * paginationSize, currentPage * paginationSize)} />
        </div>

        <div className="pagination">
          <div className="pagination-controls">
            <button className="prev" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <button className="next" disabled={currentPage === Math.ceil(count / paginationSize)} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>

          <div className="pagination-info">
            Page <span className="current-page">{currentPage}</span> of <span className="total-pages">{Math.ceil(count / paginationSize)}</span>
          </div>
        </div>
      </div>
  )
}

export default App
