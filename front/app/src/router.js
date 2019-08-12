import Vue from "vue";
import Router from "vue-router";
import featured from "./featured.js";

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
            path: "/choose",
            name: "choose",
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
        },
        {
            path: "/deposit/:hatID?",
            name: "deposit",
            beforeEnter: (to, from, next) => {
                var shortTitle = featured.filter(
                    i => i.hatID === to.params.hatID
                );
                if (shortTitle.length > 0) {
                    shortTitle = shortTitle[0].shortTitle;
                    next(`/donate/${shortTitle}`);
                } else {
                    next();
                }
            },
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
        },
        {
            path: "/donate/:shortTitle",
            name: "donate",
            /*beforeEnter: (to, from, next) => {
                // ...
            },*/
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
        },
        {
            path: "/interest",
            name: "interest",
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
            path: "*",
            name: "donation",
            component: () =>
                import(/* webpackChunkName: "donations" */ "./views/Donations.vue")
        }
    ]
});
