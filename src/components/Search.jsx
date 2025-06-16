import React from 'react'

const Search = ( {searchTerm, setSearchTerm } ) => {
    //props are readonly in child component (search component) and cannot be changed
    //never mutate state without setter function
  return (
    <div className='search'>
        <div>
            <img src='search.svg' alt='search'/>

            <input 
            type='text' 
            placeholder='Search through thousands of movies' 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default Search