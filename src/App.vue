<template>
  <div>
    <!-- v-bind:seller缩写:seller v-on:click=缩写@click -->
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>   
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- seller传入路由出口，三个子组件才能接收 keep-alive切换路由保持状态（vue-1.0是keep-alive属性） -->
    <keep-alive>
      <router-view :seller="seller"></router-view>      
    </keep-alive>

  </div>
</template>
<script>
  import {urlParse} from '@/common/js/until';
  import header from '@/components/header/header.vue';

  const ERR_OK = 0;
  export default {
    // header组件内设置Seller数据容器对象
    data () {
      return {
        seller: {
          // 商家id
          id: (() => {
            // 从url拿到id(前端)
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    // vue-resource ajax requset
    created () {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          // 设置seller数据
          this.seller = Object.assign({}, this.seller, response.data);
          console.log('app: ', this.seller);
        }
      });
    },
    // 前面引入后，父组件内注册子组件组件名不能使用html内置标签
    components: {
      'v-header': header
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      background: white
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex: 1
        text-align: center
        &>a
          font-size: 14px
          color: rgb(77,85,93)
          &.active
            color: rgb(240,20,20)
</style>
