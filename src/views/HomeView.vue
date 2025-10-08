<script setup>
import Button from '@/components/ui/button/Button.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { ChevronRight } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>
<template>
  <DashboardLayout>
    <section class="min-h-dvh bg-background text-foreground grid place-items-center">
    <div className="w-full" aria-labelledby="home-hero-title">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <header className="mb-6">
          <h1 id="home-hero-title" className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Selamat datang, superuser!
          </h1>
        </header>

        <p className="text-pretty text-muted-foreground leading-relaxed md:text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem harum consectetur consequuntur cumque ex
          maxime aperiam eius ratione dicta repellat!
        </p>

        <div className="mt-8">
        <RouterLink to="#">
          <Button class="cursor-pointer" size="lg">Ikuti Tour <ChevronRight /></Button>
        </RouterLink>
        </div>
      </div>
    </div>
</section>
  </DashboardLayout>
</template>