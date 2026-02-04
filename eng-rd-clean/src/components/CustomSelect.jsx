import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

const CustomSelect = ({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = 'Sélectionner...', 
  name = '',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const selected = options.find(option => option.value === value);
    setSelectedOption(selected || null);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: option.value
        }
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`custom-select-container ${className}`} ref={selectRef}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-select-value">
          {selectedOption ? (
            <>
              {selectedOption.emoji && (
                <span className="custom-select-emoji">{selectedOption.emoji}</span>
              )}
              {selectedOption.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <svg 
          className={`custom-select-arrow ${isOpen ? 'rotated' : ''}`}
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </div>
      
      <div className={`custom-select-options ${isOpen ? 'active' : ''}`} role="listbox">
        {options.map((option, index) => (
          <div
            key={option.value || index}
            className={`custom-select-option ${selectedOption?.value === option.value ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
            role="option"
            aria-selected={selectedOption?.value === option.value}
            tabIndex={-1}
          >
            {option.emoji && (
              <span className="custom-select-option-emoji">{option.emoji}</span>
            )}
            <span className="custom-select-option-text">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;