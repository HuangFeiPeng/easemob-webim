import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登陆IM"
    },
    component: () => import("@/views/login/login")
  },
  {
    path: "/chat",
    name: "Chat",
    redirect:'/chat/conversation',//设置重定向路由加载的指向路径，进入chat页面首先选中会话列表
    meta: {
      title: "开始畅聊"
    },

    component: () => import("@/views/chat/chat"),
    children: [
      {
        path: "conversation",
        name: "Conversation",
        meta: {
          title: "会话列表"
        },
        component: () => import("@/components/conversation/conversation")
      },
      {
        path: "friends",
        name: "Friends",
        meta: {
          title: "好友"
        },
        component: () => import("@/components/friends/friends")
      },
      {
        path: "friends/:id",
        name: "Friends/id",
        meta: {
          title: "好友"
        },
        component: () => import("@/components/friends/friends")
      },
      {
        path: "group",
        name: "Group",
        meta: {
          title: "群组"
        },
        component: () => import("@/components/group/group")
      },
      {
        path: "group/:id",
        name: "Group/id",
        meta: {
          title: "群聊天"
        },
        component: () => import("@/components/group/group")
      },
      {
        path: "chatroom",
        name: "Chatroom",
        meta: {
          title: "聊天室"
        },
        component: () => import("@/components/chatroom/chatroom")
      },
      {
        path: "chatroom/:id",
        name: "Chatroom/id",
        meta: {
          title: "聊天室"
        },
        component: () => import("@/components/chatroom/chatroom")
      },
      {
        path: "setting",
        meta: {
          title: "设置"
        },
        component: () => import("@/components/setting/setting")
      }
    ]
  }
]

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: "active",
  linkActiveClass: "active"
})
/* 使用路由守卫防止篡改URL地址栏绕过登陆 */
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.meta.title) {
    document.title = to.meta.title
    next()
    /* 判断的逻辑：如果localstorage没有userInfo字段，并且 to.path 不是login 那么就重定向到登陆。 */
    if (!localStorage.getItem("userInfo") && to.path !== "/login") {
      next("/login")
    }
  }
})

export default router
