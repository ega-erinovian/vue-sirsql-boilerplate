<script setup>
import ArticleComponent from '@/components/sample/ArticleComponent.vue';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { getPosts } from '@/services/posts/getPosts';
</script>

<template>
  <DashboardLayout>
    <div class="w-full h-full flex items-center justify-center bg-gray-100">
      <div class="container mx-auto p-4">
          <Button class="hover:cursor-pointer mb-8" @click="handleGetPosts">Show Post</Button>
          <ArticleComponent v-if="posts.length > 0" :title=posts[0].title :body=posts[0].body />
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
export default {
  name: 'SampleView',
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    async handleGetPosts() {
       try {
          const postsData = await getPosts();
          this.posts = postsData;
        } catch (error) {
          console.error('Failed to fetch posts:', error.message);
        }
    },
  },
};
</script>