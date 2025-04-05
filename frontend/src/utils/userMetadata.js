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
    return;
  }
  
  try {
    await user.update({
      publicMetadata: {
        ...user.publicMetadata,
        userType
      }
    });
    console.log(`User type set to: ${userType}`);
  } catch (error) {
    console.error('Error setting user type:', error);
    throw error;
  }
};

/**
 * Get the user's type from metadata
 * @param {Object} user - The user object from Clerk
 * @returns {string} - The user type or 'candidate' as default
 */
export const getUserType = (user) => {
  if (!user || !user.publicMetadata) {
    return 'candidate';
  }
  
  return user.publicMetadata.userType || 'candidate';
}; 