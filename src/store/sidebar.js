import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
    state: () => ({menus: []}),
    actions: {
        setMenus(data) {
            this.menus = data;
        },
        clearMenus(){
            this.menus = [];
            localStorage.removeItem("sidebar");
        }
    },
    
    persist: true,
})