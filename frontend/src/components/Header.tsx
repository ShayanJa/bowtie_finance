import React from "react";

interface Props {
  title: string;
}

const Header: React.FC<Props> = ({ title }) => {
  return (
    <header className="mt-20">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold leading-tight text-white">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
