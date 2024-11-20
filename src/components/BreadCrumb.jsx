import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ paths }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-2 text-sm">
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-500"> {'>'} </span>}
            {index === paths.length - 1 ? (
              <span className="text-gray-700">{path.name}</span>
            ) : (
              <Link to={path.link} className="text-blue-600 hover:text- blue-800">
                {path.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
