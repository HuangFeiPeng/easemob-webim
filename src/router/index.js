import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login")
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("@/views/chat/chat"),
    children: [{
        path: "friends",
        component: () => import('@/components/friends/friends')
      },
      {
        path: "group",
        component: () => import("@/components/group/group")
      },
      {
        path: "chatroom",
        component: () => import("@/components/chatroom/chatroom")
      },
      {
        path: "setting",
        component: () => import("@/components/setting/setting")
      },
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: 'active',
  linkActiveClass: 'active'
});

export default router;