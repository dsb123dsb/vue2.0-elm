<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>			
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle"  @click.stop.prevent="addCart($event)"></div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';

	export default {
		props: {
			food: {
				type: Object
			}
		},
		created() {
			// console.log(this.food);
		},
		methods: {
			addCart(event) {
				// 阻止浏览器默认点击事件（原来better-Scroll会移动端会阻止默认点击事件，现在也不会了，其实现在只用默认的就好）
				if (!event._constructed) {
					return;
				}
				// console.log('click');
				if (!this.food.count) {
					// 对于添加原来没有的属性不能直接赋值，否则fefineProperty检测不到属性变化，DOMd当然也不会发生变化，新增和删除属性时要用Vue的set接口
					Vue.set(this.food, 'count', 1);
					// this.food.count = 1;
				} else {
					this.food.count++;
				}
				// 派发事件，同时传出事件对象,$dispatch方法移除和vue1.0区别
				this.$emit('add', event.target);
			},
			decreaseCart(event) {
				if (!event._constructed) {
					return;
				}
				if (this.food.count) {
					this.food.count--;
				}
			}
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.cartcontrol
		font-size: 0
		.cart-decrease
			display: inline-block
			padding: 6px
			// 初始状态，translate3d() CSS 函数在3D空间内移动一个元素的位置. 这个移动由一个三维向量来表达，分别表示他在三个方向上移动的距离，可开启硬件加速
			opacity: 1
			transform: translate3d(0, 0, 0)
			.inner
				// 内联元素无法设置宽高
				display: inline-block
				line-height: 24px
				font-size: 24px	
				color: rgb(0,160,220)
				transition: all 0.4s linear
				transform: rotate(0)
			// 书写格式好坑，空格错误，还不提示
			&.move-enter, &.move-leave-active
				opacity: 0
				transform: translate3d(24px, 0, 0)
			&.move-enter-active, &.move-leave-active
				transition: all 0.4s linear				
				.inner
					transform: rotate(180deg)			
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147,153,159)
		.cart-add
			display: inline-block
			padding: 6px
			line-height: 24px
			font-size: 24px	
			color: rgb(0,160,220)
</style>
