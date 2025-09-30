<script setup>
import { Button } from '@/components/ui/button'
import { usePosts } from '@/composables/queries/usePosts'

import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Use the posts query
const { 
  data, 
  isLoading, 
  error, 
  refetch, 
  isRefetching,
  isFetching,
  isStale,
  dataUpdatedAt
} = usePosts({
  staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes when window is focused
});
</script>
<template>
  <DashboardLayout>
    <div class="w-full h-full flex items-center justify-center bg-gray-100">
      <div class="container mx-auto p-4">
        <!-- Control Buttons -->
        <div class="flex gap-4 mb-8">
          <Button 
            class="hover:cursor-pointer" 
            @click="refetch"
            :disabled="isRefetching"
          >
            {{ isRefetching ? 'Refreshing...' : 'Refresh Posts' }}
          </Button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span class="ml-2">Loading posts...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div class="text-red-800">
            <strong>Error:</strong> {{ error.message }}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            class="mt-2"
            @click="refetch"
          >
            Try Again
          </Button>
        </div>

        <!-- Success State with Data -->
        <div v-else-if="data && data.length > 0">
          <!-- Posts List -->
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div 
              v-for="post in data.slice(0, 12)" 
              :key="post.id"
              class="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <h3 class="font-semibold text-sm mb-2 line-clamp-2">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 text-xs line-clamp-3">
                {{ post.body }}
              </p>
            </div>
          </div>

          <!-- Data Info -->
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div class="text-blue-800 text-sm">
              <strong>Cache Info:</strong> 
              Showing {{ data.length }} posts. 
              Last fetched: {{ dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never' }}
              {{ isStale ? '(Data is stale)' : '(Data is fresh)' }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500">No posts available</p>
        </div>

        <!-- Background Indicators -->
        <div v-if="isFetching && !isLoading" class="fixed bottom-4 right-4 z-50">
          <div class="bg-blue-500 text-white px-3 py-2 rounded-md shadow-lg text-sm">
            Updating in background...
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>