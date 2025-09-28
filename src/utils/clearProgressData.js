/**
 * Utility function to clear all learning path progress data
 * This can be used to reset all users' progress to 0%
 */

export const clearAllProgressData = () => {
  console.log('🧹 Clearing all learning path progress data...')
  
  // List of all possible localStorage keys that might contain progress data
  const progressKeys = [
    'beginnerProgress',
    'intermediateProgress', 
    'expertProgress',
    'learningProgress',
    'userProgress',
    'moduleProgress',
    'completedModules'
  ]
  
  let clearedCount = 0
  
  // Clear known progress keys
  progressKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
      clearedCount++
      console.log(`✅ Cleared: ${key}`)
    }
  })
  
  // Clear any user-specific progress keys
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (key && (
      key.includes('beginnerProgress') || 
      key.includes('intermediateProgress') || 
      key.includes('expertProgress') ||
      key.includes('_user_')
    )) {
      localStorage.removeItem(key)
      clearedCount++
      console.log(`✅ Cleared user-specific: ${key}`)
    }
  }
  
  console.log(`🎉 Successfully cleared ${clearedCount} progress entries`)
  return clearedCount
}

/**
 * Check if progress data exists for any user
 */
export const checkProgressDataExists = () => {
  const progressKeys = [
    'beginnerProgress',
    'intermediateProgress', 
    'expertProgress',
    'learningProgress',
    'userProgress'
  ]
  
  let foundKeys = []
  
  // Check known progress keys
  progressKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      foundKeys.push(key)
    }
  })
  
  // Check user-specific keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (
      key.includes('beginnerProgress') || 
      key.includes('intermediateProgress') || 
      key.includes('expertProgress')
    )) {
      foundKeys.push(key)
    }
  }
  
  return foundKeys
}

/**
 * Get progress data summary
 */
export const getProgressDataSummary = () => {
  const summary = {
    totalKeys: localStorage.length,
    progressKeys: [],
    userSpecificKeys: []
  }
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      if (key.includes('beginnerProgress') || key.includes('intermediateProgress') || key.includes('expertProgress')) {
        if (key.includes('_user_')) {
          summary.userSpecificKeys.push(key)
        } else {
          summary.progressKeys.push(key)
        }
      }
    }
  }
  
  return summary
}

// Make functions available in browser console for debugging
if (typeof window !== 'undefined') {
  window.clearAllProgressData = clearAllProgressData
  window.checkProgressDataExists = checkProgressDataExists
  window.getProgressDataSummary = getProgressDataSummary
}
