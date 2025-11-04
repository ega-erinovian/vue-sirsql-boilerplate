<script setup>
import Button from "@/components/ui/button/Button.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { ChevronRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>
<template>
  <DashboardLayout>
    <section class="h-full grid place-items-center">
      <CardLayout cardClass="max-w-xl lg:max-w-xl">
        <div className="mx-auto px-4 py-16">
          <header className="mb-4">
            <h1
              id="home-hero-title"
              className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Selamat datang
            </h1>
          </header>

          <p
            className="text-pretty text-muted-foreground leading-relaxed md:text-md"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
            harum consectetur consequuntur cumque ex maxime aperiam eius ratione
            dicta repellat!
          </p>

          <div className="mt-6">
            <RouterLink to="#">
              <Button class="cursor-pointer"
                >Ikuti Tour <ChevronRight
              /></Button>
            </RouterLink>
          </div>
        </div>
      </CardLayout>
    </section>
  </DashboardLayout>
</template>
