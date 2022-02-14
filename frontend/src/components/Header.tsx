import React from 'react'

interface Props {
  title: string
}

const Header: React.FC<Props> = ({ title }) => {
  return (
    <header className="shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight text-white">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header
