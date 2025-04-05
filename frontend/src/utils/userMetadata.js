import { useClerk } from '@clerk/clerk-react';

/**
 * Set user type in metadata
 * @param {Object} user - The user object from Clerk
 * @param {string} userType - The user type ('recruiter' or 'candidate')
 * @returns {Promise<void>}
 */
export const setUserType = async (user, userType) => {
  if (!user) {
    console.error('No user available to set metadata');
    throw new Error('No user available to set metadata');
  }
  
  if (!userType || (userType !== 'recruiter' && userType !== 'candidate')) {
    console.error(`Invalid user type: ${userType}`);
    throw new Error(`Invalid user type: ${userType}`);
  }
  
  try {
    console.log('Attempting to update user metadata with type:', userType);
    console.log('Current public metadata:', user.publicMetadata);
    
    await user.update({
      publicMetadata: {
        ...user.publicMetadata,
        userType
      }
    });
    
    console.log(`User type set to: ${userType}`);
    return true;
  } catch (error) {
    console.error('Error setting user type:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

/**
 * Get the user's type from metadata with localStorage fallback
 * @param {Object} user - The user object from Clerk
 * @returns {string} - The user type or 'candidate' as default
 */
export const getUserType = (user) => {
  // First check if user has metadata
  if (user && user.publicMetadata && user.publicMetadata.userType) {
    return user.publicMetadata.userType;
  }
  
  // Then check localStorage as fallback
  if (user && localStorage.getItem('userType') && 
      localStorage.getItem('userEmail') === user.primaryEmailAddress?.emailAddress) {
    return localStorage.getItem('userType');
  }
  
  // Default to candidate
  return 'candidate';
}; 