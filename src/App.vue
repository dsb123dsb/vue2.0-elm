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
    <router-view></router-view>
  </div>
</template>
<script>
  import header from '@/components/header/header.vue';

  const ERR_OK = 0;
  export default {
    // header组件内设置Seller数据容器对象
    data () {
      return {
        seller: {}
      };
    },
    // vue-resource ajax requset
    created () {
      this.$http.get('/api/seller').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          // 设置seller数据
          this.seller = response.data;
          console.log(this.seller);
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
