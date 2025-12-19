import { useState } from 'react';

export const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    // Handle both standard events and the custom object from InputSelect
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return [formData, handleChange, setFormData];
};