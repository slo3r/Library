import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface SearchBarProps {
  onSearch: (searchType: string, term: string, startYear: number, endYear: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [startYear, setStartYear] = useState(1900);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [yearRange, setYearRange] = useState<[number, number]>([1600, new Date().getFullYear()]);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchType, searchTerm, startYear, endYear);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
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
      </div>
      <div>
        <label>
          Year Range: {startYear} - {endYear}
        </label>
        <input
          type="range"
          min="1605"
          max={new Date().getFullYear()}
          value={startYear}
          onChange={(e) => setStartYear(Number(e.target.value))}
        />
        <input
          type="range"
          min="1605"
          max={new Date().getFullYear()}
          value={endYear}
          onChange={(e) => setEndYear(Number(e.target.value))}
        />
      </div>
      <label>
          Year Range: {yearRange[0]} - {yearRange[1]}
        </label>
        <Slider
          range
          min={1600}
          max={new Date().getFullYear()}
          defaultValue={yearRange}
          onChange={(value) => setYearRange(value as [number, number])}
        />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
