import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Transaction from "../views/Transaction.vue";
import Procedure from "@/views/Procedure.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/transaction",
      component: Transaction,
    },
    {
      path: "/procedure",
      component: Procedure,
    },
  ],
});

export default router;
