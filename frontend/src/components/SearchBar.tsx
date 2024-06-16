import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface SearchBarProps {
  onSearch: (searchType: string, term: string, startYear: number, endYear: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [yearRange, setYearRange] = useState<[number, number]>([1600, new Date().getFullYear()]);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchType, searchTerm, yearRange[0], yearRange[1]);
  };

  return (
    <form onSubmit={handleSearch}>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </div>
      <div className='searchFilters'>
          <label>
            <input
              type="radio"
              value="title"
              checked={searchType === 'title'}
              onChange={(e) => setSearchType(e.target.value)}
            />
            Title
          </label>
          <label>
            <input
              type="radio"
              value="author"
              checked={searchType === 'author'}
              onChange={(e) => setSearchType(e.target.value)}
            />
            Author
          </label>
        <div>
          <label>
            Year Range: <b>{yearRange[0]}</b> - <b>{yearRange[1]}</b>
          </label>
          <Slider
            range
            min={1600}
            max={new Date().getFullYear()}
            defaultValue={yearRange}
            onChange={(value) => setYearRange(value as [number, number])}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
