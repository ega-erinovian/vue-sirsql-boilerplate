<script setup>
import { ref } from "vue";
// import { GalleryVerticalEnd } from "lucide-vue-next";
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

const AuthMutation = useMutation({
  mutationFn: async () => {
    // login
    const { data } = await authService.login({
      username: username.value,
      password: password.value
    });

    // Separate token and user data
    const {accessToken, ...user} = data;

    // store user and token to pinia
    authStore.login(accessToken, user);
  },
  onSuccess: () => {
    router.push({ name: 'Dashboard' });
  },
  onError: (error) => {
    console.error("Login failed:", error);
    alert("Login failed. Please check your credentials and try again.");
  }
});

const authSubmitHandle = () => {
  AuthMutation.mutate();
};
</script>
<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <a href="#" class="flex items-center gap-2 font-medium">
          <div
            class="flex h-8 w-8 items-center justify-center text-primary-foreground"
          >
             <img src="../assets/logo-rsql.webp" alt="logo-rsql">
          </div>
          <span class="font-bold">
            SITIQL
          </span>
        </a>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <form class="flex flex-col gap-6" @submit.prevent="authSubmitHandle">
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">Selamat Datang</h1>
            </div>
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="username">Username</Label>
                <Input v-model="username" id="username" type="text" placeholder="johnDoe" required />
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
                <Input v-model="password" id="password" type="password" required />
              </div>
              <Button type="submit" class="w-full cursor-pointer"> Login </Button>
            </div>
            <div class="text-center text-sm">
              Don't have an account?
              <a href="#" class="underline underline-offset-4"> Sign up </a>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="relative hidden bg-muted lg:block">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        alt="Image"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
