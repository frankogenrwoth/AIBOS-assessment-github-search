import React from 'react';
import type { Repository } from '../types';
import RepositoryItem from './RepositoryItem';

interface Props {
  repositories: Repository[];
}

export const RepositoriesList: React.FC<Props> = ({ repositories }) => {
  if (!repositories.length) {
    return <div className="no-results">No repositories found.</div>;
  }

  return (
    <section className="repo-list">
      {repositories.map((r) => (
        <RepositoryItem key={r.id} repo={r} />
      ))}
    </section>
  );
};

export default RepositoriesList;
