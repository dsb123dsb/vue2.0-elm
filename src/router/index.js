import Vue from 'vue';
import VueRouter from 'vue-router';
import goods from '@/components/goods/goods';
import ratings from '@/components/ratings/ratings';
import seller from '@/components/seller/seller';

Vue.use(VueRouter);

export default new VueRouter({// 路由导出并配置参数
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      // name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      // name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      // name: 'seller',
      component: seller
    }
  ]
});
