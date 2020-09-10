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
    meta: {
      title: '登陆IM'
    },
    component: () => import("@/views/login/login")
  },
  {
    path: "/chat",
    name: "Chat",
    meta: {
      title: '开始畅聊'
    },
    component: () => import("@/views/chat/chat"),
    children: [{
        path: "friends",
        meta: {
          title: '好友'
        },
        component: () => import('@/components/friends/friends')
      },
      {
        path: "group",
        meta: {
          title: '群组'
        },
        component: () => import("@/components/group/group")
      },
      {
        path: "chatroom",
        meta: {
          title: '聊天室'
        },
        component: () => import("@/components/chatroom/chatroom")
      },
      {
        path: "setting",
        meta: {
          title: '设置'
        },
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
/* 使用路由守卫防止篡改URL地址栏绕过登陆 */
router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.meta.title) {
    document.title = to.meta.title;
    next();
    /* 判断的逻辑：如果localstorage没有userInfo字段，并且 to.path 不是login 那么就重定向到登陆。 */
    if(!localStorage.getItem("userInfo") && to.path !== "/login"){
      next("/login");
    }
  }
})

export default router;