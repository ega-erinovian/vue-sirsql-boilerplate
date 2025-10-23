<script setup>
import {
  ArticleCard,
  ErrorFetch,
  LoadingPost,
} from "@/components/features/sample";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/composables/queries/usePosts";

import DashboardLayout from "@/layouts/DashboardLayout.vue";

// Use the posts query
const {
  data,
  isLoading,
  error,
  refetch,
  isRefetching,
  isFetching,
  isStale,
  dataUpdatedAt,
} = usePosts({
  staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes when window is focused
});
</script>
<template>
  <DashboardLayout>
    <div class="w-full h-full flex items-center justify-center">
      <div class="container mx-auto p-4">
        <div class="flex gap-4 mb-8">
          <Button
            class="hover:cursor-pointer"
            @click="refetch"
            :disabled="isRefetching"
          >
            {{ isRefetching ? "Refreshing..." : "Refresh Posts" }}
          </Button>
        </div>

        <LoadingPost v-if="isLoading" />

        <ErrorFetch v-else-if="error" :errorMessage="error.message" />

        <!-- Success State with Data -->
        <div v-else-if="data && data.length > 0">
          <!-- Posts List -->
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ArticleCard
              v-for="post in data.slice(0, 12)"
              :key="post.id"
              :title="post.title"
              :body="post.body"
            />
          </div>

          <!-- Data Info -->
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div class="text-blue-800 text-sm">
              <strong>Cache Info:</strong>
              Showing {{ data.length }} posts. Last fetched:
              {{
                dataUpdatedAt
                  ? new Date(dataUpdatedAt).toLocaleTimeString()
                  : "Never"
              }}
              {{ isStale ? "(Data is stale)" : "(Data is fresh)" }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500">No posts available</p>
        </div>

        <!-- Background Indicators -->
        <div
          v-if="isFetching && !isLoading"
          class="fixed bottom-4 right-4 z-50"
        >
          <div
            class="bg-blue-500 text-white px-3 py-2 rounded-md shadow-lg text-sm"
          >
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
