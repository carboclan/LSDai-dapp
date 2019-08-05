import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/create/",
            name: "create",
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
        },
        {
            path: "/deposit/:hatID?",
            name: "deposit",
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
        },
        {
            path: "/donate/:shortTitle",
            name: "donate",
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
        },
        {
            path: "/withdraw",
            name: "withdraw",
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
        },
        {
            path: "/redeem",
            name: "redeem",
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
        },
        {
            path: "/about",
            name: "about",
            component: () =>
                import(/* webpackChunkName: "about" */ "./views/About.vue")
        },
        {
            path: "*",
            name: "donation",
            component: () =>
                import(/* webpackChunkName: "donations" */ "./views/Donations.vue")
        }
    ]
});
