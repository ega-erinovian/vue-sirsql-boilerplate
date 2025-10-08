<script setup>
import { ref } from "vue";
import { useMutation } from '@tanstack/vue-query'
import { useRouter } from "vue-router";
import { authService } from "@/services/auth/auth.js";
import { useAuthStore } from "@/store/auth";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const authMutation = useMutation({
  mutationFn: async () => {
    const { data } = await authService.login({
      username: username.value,
      password: password.value
    });
    
    authStore.login(data.data);
  },
  onSuccess: () => {
    router.push({ name: 'Beranda' });
  },
  onError: (error) => {
    console.error("Login failed:", error);
    errorMessage.value = error.response?.data?.message || "Login failed. Please check your credentials.";
  }
});

const authSubmitHandle = () => {
  errorMessage.value = "";
  authMutation.mutate();
};
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <form class="flex flex-col gap-6" @submit.prevent="authSubmitHandle">
            <div class="flex flex-col items-center gap-4 text-center">
              <div class="w-16 h-16">
                <img src="../assets/logo-rsql.webp" alt="logo-rsql">
              </div>
            </div>
            
            <!-- Error message -->
            <div v-if="errorMessage" class="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {{ errorMessage }}
            </div>
            
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="username">Username</Label>
                <Input 
                  v-model="username" 
                  id="username" 
                  type="text" 
                  placeholder="johnDoe" 
                  required 
                  :disabled="authMutation.isPending.value"
                />
              </div>
              <div class="grid gap-3">
                <div class="flex items-center">
                  <Label for="password">Password</Label>
                  <a
                    href="#"
                    class="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  v-model="password" 
                  id="password" 
                  type="password" 
                  required 
                  :disabled="authMutation.isPending.value"
                />
              </div>
              <Button 
                type="submit" 
                class="w-full cursor-pointer" 
                :disabled="authMutation.isPending.value"
              > 
                {{ authMutation.isPending.value ? 'Loading...' : 'Login' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="relative hidden bg-muted lg:block">
      <img
        src="/login-poster/quin-latifa-rs.webp"
        alt="Image"
        class="absolute inset-0 h-full w-full object-cover object-top dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>