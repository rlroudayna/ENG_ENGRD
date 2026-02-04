// Utility functions for safe date formatting

export const formatDate = (dateValue, options = {}) => {
  if (!dateValue) {
    return 'Date non disponible';
  }

  try {
    const date = new Date(dateValue);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return 'Date invalide';
    }

    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    };

    return date.toLocaleDateString('fr-FR', defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error, 'Value:', dateValue);
    return 'Erreur de date';
  }
};

export const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return 'Date non disponible';
  }

  try {
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return 'Date invalide';
    }

    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting datetime:', error, 'Value:', dateValue);
    return 'Erreur de date';
  }
};

export const getApplicationDate = (application) => {
  // Try different date fields in order of preference
  const dateFields = ['createdAt', 'appliedAt', 'updatedAt'];
  
  for (const field of dateFields) {
    if (application[field]) {
      return formatDate(application[field]);
    }
  }
  
  return 'Date non disponible';
};

export const getMessageDate = (message) => {
  // Try different date fields for messages in order of preference
  const dateFields = ['createdAt', 'receivedAt', 'updatedAt'];
  
  for (const field of dateFields) {
    if (message[field]) {
      return formatDate(message[field]);
    }
  }
  
  return 'Date non disponible';
};

export const isDateWithinDays = (item, days) => {
  // Try different date fields to find a valid date
  const dateFields = ['createdAt', 'receivedAt', 'appliedAt', 'publishedAt', 'updatedAt'];
  
  for (const field of dateFields) {
    if (item[field]) {
      try {
        const itemDate = new Date(item[field]);
        if (!isNaN(itemDate.getTime())) {
          const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
          return itemDate > cutoffDate;
        }
      } catch (error) {
        console.warn(`Error comparing date for field ${field}:`, error);
      }
    }
  }
  
  return false; // If no valid date found, exclude from count
};