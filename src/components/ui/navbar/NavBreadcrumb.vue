<script setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
</script>
<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem class="hidden md:block">
        <BreadcrumbPage> Beranda </BreadcrumbPage>
      </BreadcrumbItem>
      <!-- <BreadcrumbSeparator class="hidden md:block" />
    <BreadcrumbItem>
      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
    </BreadcrumbItem> -->
    </BreadcrumbList>
  </Breadcrumb>
</template>
