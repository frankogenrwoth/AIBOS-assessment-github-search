import { use, useEffect, useState } from 'react'
import './App.css'
import type { Repository } from './types';
import RepositoriesList from './components/RepositoriesList';

function App() {
  const [count, setCount] = useState(0);

  const [paginationSize, setPaginationSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSearch, setNewSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('best');
  const [loading, setLoading] = useState(false);
  const [orderedRepositories, setOrderedRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/repositories', {credentials: 'include'})
      .then((response) => response.json())
      .then((data) => { 
        setLoading(true);
        setRepositories(data);
        setCount(data.length);

        if (filter == 'all') {
          setOrderedRepositories(data);
        } else {
          setOrderedRepositories(data.filter((repo: Repository) => repo.language?.toLowerCase() === filter));
        }
        if (sort == 'best') {
          setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.score - a.score));
        } else if (sort == 'stars') {
          setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.stargazers_count - a.stargazers_count));
        } else if (sort == 'watchers') {
          setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.watchers_count - a.watchers_count));
        } else if (sort == 'size') {
          setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.size - a.size));
        } else if (sort == 'issues') {
          setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.open_issues - a.open_issues));
        } else if (sort == 'forks') {
          setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.forks - a.forks));
        };
        setLoading(false);
        
      })
      .catch((error) => console.error('Error fetching repositories:', error))
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [paginationSize]);

  useEffect(() => {
    if (filter == 'all') {
      setOrderedRepositories(repositories);
    } else {
      setOrderedRepositories(repositories.filter((repo: Repository) => repo.language?.toLowerCase() === filter));
    }
    setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b?.score - a.score));
  }, [filter, repositories]);

  useEffect(() => {
    if (sort == 'best') {
      setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.score - a.score));
    } else if (sort == 'stars') {
      setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.stargazers_count - a.stargazers_count));
    } else if (sort == 'watchers') {
      setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.watchers_count - a.watchers_count));
    } else if (sort == 'size') {
      setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.size - a.size));
    } else if (sort == 'issues') {
      setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.open_issues - a.open_issues));
    } else if (sort == 'forks') {
      setOrderedRepositories((prev) => prev.sort((a: Repository, b: Repository) => b.forks - a.forks));
    }
  }, [sort]);

  useEffect(() => {
    setCount(orderedRepositories.length);
  }, [orderedRepositories]);

  function searchKeyword() {
    setLoading(true);
    fetch(`http://localhost:8000/api/v1/search?q=${searchTerm}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => { setRepositories(data); setCount(data.length); setNewSearch(true); })
      .catch((error) => console.error('Error fetching repositories:', error));
    setLoading(false);
  }

  return (
      <div className="wrapper">
        <div className="header">
          <div className="search">
            <div className="search-box">
              <input type="text" placeholder="Search repositories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button onClick={() => {searchKeyword()}}>Search</button>
            </div>
            
          </div>

          <div className="action">
            <div className="sort">
              <label htmlFor="sort-by">Sort by:</label>
              <select className="form-control select-wrapper" id="sort-by" defaultValue="best" aria-label="Sort repositories" onChange={() => {}}>
                <option value="best">Best match</option>
                <option value="stars">Most stars</option>
                <option value="watchers">most watchers</option>
                <option value="size">size</option>
                <option value="issues">most issues</option>
                <option value="forks">Most forks</option>
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
          <div className="result-count">{count} results {(searchTerm && newSearch) && (<>found in <span className="search-time">"{searchTerm}"</span></> )}</div>
          
          <div className="filters">
              <div className="filter-chip">
                <input className='filter-chip-input' id="all" name="all-filter" type="checkbox" value="all" checked={filter === 'all'} onChange={() => setFilter('all')} /> 
                <label className='filter-chip-label' htmlFor="all">All</label>
              </div>
              <div className="filter-chip">
            <input className='filter-chip-input' id="python" name="python-filter" type="checkbox" value="python" checked={filter === 'python'} onChange={() => setFilter('python')} /> 
                <label className='filter-chip-label' htmlFor="python">Python</label>
              </div>
              <div className="filter-chip">
            <input className='filter-chip-input' id="js" name="js-filter" type="checkbox" value="javascript" checked={filter === 'javascript'} onChange={() => setFilter('javascript')} /> 
                <label className='filter-chip-label' htmlFor="js">JS</label>

              </div>
              <div className="filter-chip">
            <input className='filter-chip-input' id="typescript" name="typescript-filter" type="checkbox" value="typescript" checked={filter === 'typescript'} onChange={() => setFilter('typescript')} /> 
                <label className='filter-chip-label' htmlFor="typescript">Typescript</label>
                
              </div>
              <div className="filter-chip">
            <input className='filter-chip-input' id="c" name="c-filter" type="checkbox" value="c" checked={filter === 'c'} onChange={() => setFilter('c')} /> 
                <label className='filter-chip-label' htmlFor="c">C</label>
                
              </div>

          </div>
        </div>

        <div className="container">
          {loading && <><span>Loading repositories</span></>}
          {!loading && 
          <RepositoriesList repositories={orderedRepositories.slice((currentPage - 1) * paginationSize, currentPage * paginationSize)} />
          }
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
