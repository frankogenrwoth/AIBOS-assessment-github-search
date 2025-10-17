import React from 'react';
import { type Repository } from '../types';
import { languageColors } from '../data';

interface Props {
  repo: Repository;
}



export const RepositoryItem: React.FC<Props> = ({ repo }) => {
    const lang = repo.language ?? '';
    const langColor = (languageColors[lang] && languageColors[lang].color) ? languageColors[lang].color : 'transparent';

    return (
    <article className="repo-item">
        <div className="repo-content">
            <div className="repo-ownership">
                <img src={repo.owner.avatar_url ? repo.owner.avatar_url : ''} alt={repo.full_name} />
                <span>{repo.full_name}</span>
            </div>
            <div className="repo-description">
                {repo.description ?? 'No description'}
            </div>
            <div className="repo-stats">
                <div className="repo-language">
                    <span className="repo-language-code" style={{ backgroundColor: langColor }}></span>
                    <span>{repo.language ?? '—'}</span>
                </div>
                <div className="repo-stars">
                    ⭐ {repo.stargazers_count}
                </div>
                <div className="repo-last-updated">
                    Updated {new Date(repo.updated_at).toLocaleDateString()} ago
                </div>
            </div>
        </div>
        <div className="repo-action">
            <button type="button">View</button>
        </div>
    </article>
  );
};

export default RepositoryItem;
