import React from 'react'
import { assets } from '../../assets/assets'
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

const SearchBar = ({data}) => {

  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : "")
  const onSearchHandler = (e) =>{
     e.preventDefault()
     navigate('/course-list/' + input)

  }

  return (
    
    <form onSubmit={onSearchHandler} className="search-form">
    <img src={assets.search_icon} alt="search icon" className="search-icon" />
    <input
      type="text"
      placeholder="Search for Courses"
      className="search-input"
      onChange={e=>setInput(e.target.value)}
      value={input}
    />
    <button type="submit" className="search-button">
      Search
    </button>

     {/* possible improvement - search inputs can be saved for recommendation in search bar */}
    
  </form>
  
    
   
  )
}

export default SearchBar