// Utility function to seed task categories
export const seedTaskCategories = async () => {
  try {
    const response = await fetch('/api/seed-task-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Task categories seeded successfully:', data);
      return data;
    } else {
      console.error('Failed to seed task categories:', data);
      return null;
    }
  } catch (error) {
    console.error('Error seeding task categories:', error);
    return null;
  }
};
