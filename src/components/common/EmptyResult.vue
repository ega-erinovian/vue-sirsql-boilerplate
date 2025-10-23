<script setup>
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Button } from "../ui/button";
import { FileX, RefreshCcw } from "lucide-vue-next";

const emit = defineEmits(["refreshBtnClick"]);

const handleRefreshBtn = () => {
  emit("refreshBtnClick");
};
</script>

<template>
  <Empty class="border border-dashed">
    <EmptyHeader>
      <EmptyMedia
        variant="icon"
        class="rounded-full animate-pulse text-red-500 bg-red-100 w-12 h-12"
      >
        <FileX />
      </EmptyMedia>
      <EmptyTitle class="font-bold">Data Not Found</EmptyTitle>
      <EmptyDescription> Try to refresh in a moment. </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm" @click="handleRefreshBtn" class="cursor-pointer">
        <RefreshCcw />
        Refresh
      </Button>
    </EmptyContent>
  </Empty>
</template>
