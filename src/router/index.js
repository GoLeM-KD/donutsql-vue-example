import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Transaction from "../views/Transaction.vue";

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
  ],
});

export default router;