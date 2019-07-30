import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "donation",
      component: () => import(/* webpackChunkName: "donations" */ "./views/Donations.vue")
    },
    {
      path: "/deposit",
      name: "deposit",
      component: () => import(/* webpackChunkName: "interface" */ "./views/Interface.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
