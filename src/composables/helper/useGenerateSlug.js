// composables/useSlug.js
import { ref, computed } from 'vue'

function useGenerateSlug() {
  const input = ref('')
  
  // Main slug generation function
  const generateSlug = (str) => {
    if (!str) return ''
    
    return str
      .toString()
      .toLowerCase()                    // Convert to lowercase
      .trim()                           // Remove whitespace from ends
      .replace(/[\s\W-]+/g, '-')        // Replace spaces/special chars with hyphens
      .replace(/^-+|-+$/g, '')          // Remove leading/trailing hyphens
  }
  
  // Computed property for reactive slug generation
  const slug = computed(() => generateSlug(input.value))
  
  return {
    input,
    slug,
    generateSlug
  }
}

export default useGenerateSlug;