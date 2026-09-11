// * ==========================================================================
// *                      ENVIRONMENT VARIABLE UTILITIES
// * ==========================================================================

/**
 * Safely retrieves the value of an environment variable, with error handling.
 * Logs an error and returns an empty string if the variable is not defined.
 * @param key - The name of the environment variable.
 * @returns The value of the environment variable or an empty string if not found.
 */
export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === null) { // Check specifically for undefined/null
    // In production, consider using a proper logger instead of console.error
    console.error(`Environment variable ${key} is not defined!`);
    return '';
  }
  return value;
}; 