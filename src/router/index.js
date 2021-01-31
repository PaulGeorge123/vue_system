import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: () => import('../views/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            meta: { title: 'Layout' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../views/layout/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/usermanage',
                    component: () => import('../views/layout/UserManage.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    // markdown组件
                    path: '/blog/markdown',
                    component: () => import('../views/layout/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // markdown 博客回显
                    path: '/blog/markdownecho',
                    component: () => import('../views/layout/MarkdownEcho.vue'),
                    meta: { title: 'markdown 博客回显' }
                },
                {
                    // markdown 博客回显
                    path: '/blog/blogall',
                    component: () => import('../views/layout/BlogAll.vue'),
                    meta: { title: 'markdown 所有博客' }
                }
            ]
        },
        {
            path: '/*',
            component: () => import('../views/unfind/404.vue'),
            meta: { title: '404' }
        },
        {
            path: '/403',
            component: () => import('../views/unfind/403.vue'),
            meta: { title: '403' }
        }
    ]
});
