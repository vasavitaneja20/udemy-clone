import React from 'react'
import { assets } from '../../assets/assets'
import './Hero.css'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className="hero-container">
      <h1 className="hero-heading">
        Empower your future with courses designed to <span className="highlight">fit your choice</span>
       
      </h1>

      <p className="hero-desc desktop">
        We bring together world-class instructors, interactive content, and a supportive
        community to help you achieve your personal and professional goals.
      </p>

      <p className="hero-desc mobile">
        We bring together world-class instructors to help you achieve your personal and professional goals.
      </p>
      <SearchBar />
    </div>
  )
}

export default Hero
