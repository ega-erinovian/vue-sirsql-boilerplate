<script setup>
import Button from "@/components/ui/button/Button.vue";
import { Card } from "@/components/ui/card";
import CardContent from "@/components/ui/card/CardContent.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { ChevronRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>
<template>
  <DashboardLayout>
    <section class="min-h-dvh grid place-items-center">
      <div
        className="w-full container mx-auto"
        aria-labelledby="home-hero-title"
      >
        <Card class="mx-28">
          <CardContent>
            <div className="mx-auto px-4 py-16 md:py-24">
              <header className="mb-4">
                <h1
                  id="home-hero-title"
                  className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
                >
                  Selamat datang, superuser!
                </h1>
              </header>

              <p
                className="text-pretty text-muted-foreground leading-relaxed md:text-md"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
                harum consectetur consequuntur cumque ex maxime aperiam eius
                ratione dicta repellat!
              </p>

              <div className="mt-6">
                <RouterLink to="#">
                  <Button class="cursor-pointer"
                    >Ikuti Tour <ChevronRight
                  /></Button>
                </RouterLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  </DashboardLayout>
</template>
