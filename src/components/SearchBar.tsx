import React, { useState } from 'react';

const SearchBar = () => {


    return (
        <form >
            <input
                type="text"
                placeholder="Search..."
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
