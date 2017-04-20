<template>
	<div>
		<!-- 动态绑定v-bind:seller缩写:seller v-on:click=缩写@click= -->
		<div class="goods">
			<!-- ref属性和vue1.0的v-el:不同 -->
			<div class="menu-wapper" ref="menuWrapper">
				<ul>
					<!-- 计算menu和foods联动 -->
					<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
						<span class="text border-1px">
							<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref="foodsWrapper">
				<ul>
					<li v-for="item in goods" class="food-list food-list-hook">
						<h1 class="title">{{item.name}}</h1>
						<ul>
							<!-- 单击商品列表，选择商品，将food传入子组件，进入详情页 -->
							<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
								<div class="icon">
									<!-- 图片建议直接在标签内写好宽高 -->
									<img width="57" height="57" :src="food.icon" alt="">
								</div>
								<div class="content">
									<h2 class="name">{{food.name}}</h2>
									<p class="desc">{{food.description}}</p>
									<div class="extra">
										<span class="count">月售{{food.sellCount}}份</span>
										<span class="rating">好评率: {{food.rating}}%</span>
									</div>
									<div class="price">
										<span class="now">￥{{food.price}}</span>
										<span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
									</div>
									<div class="cartcontrol-wrapper">
										<!-- 使用 v-on缩写@，监听子组件上 $emit 的变化，是跨多层父子组件通信的话， $emit （仔组件定义）并没有什么用 -->
										<cartcontrol @add="addFood" :food="food"></cartcontrol>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>		
		<!-- 使用 v-on缩写@，监听子组件上 $emit 的变化，是跨多层父子组件通信的话， $emit （仔组件定义）并没有什么用 -->
		</div>
		<!-- 同级z-index才会比较 -->
		<shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		<!-- food组件要和goods同级，要不会被header遮挡 -->
		<!-- add接收子组件传出事件，并且触发父组件相同事件 -->
		<food @add="addFood" :food="selectedFood" ref="food"></food>			
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import shopcart from '@/components/shopcart/shopcart';
	import cartcontrol from '@/components/cartcontrol/cartcontrol';
	import food from '@/components/food/food';

	const ERR_OK = 0;

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],
				// foods列表高度
				listHeight: [],
				scrollY: 0,
				selectedFood: {}
			};
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					console.log(this.goods);
					// 更新数据时DOM并没有更新，是异步的，要下一个nextTick
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					});
				}
			});
		},
		computed: {
			// 计算滚动到第几个列表，并返回索引
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 - 1 && this.scrollY < height2 - 1)) {
						// console.log('now :' + i);
						return i;
					}
				}
				// 若循环没有返回，这里返回函数值未0
				return	0;
			},
			// 遍历选中的food(有无count属性)并且传入购物车组件
			selectFoods() {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		methods: {
			// 左侧点击menu。右侧foods列表对应变化
			selectMenu(index, event) {
				// 阻止浏览器默认点击事件（原来better-Scroll会移动端会阻止默认点击事件，现在也不会了，其实现在只用默认的就好）
				if (!event._constructed) {
					return;
				}
				// console.log(index);
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				// better-Scroll接口
				this.foodsScroll.scrollToElement(el, 300);
			},
			// 点击商品 进入详情页,点击的food传入子组件
			selectFood(food, event) {
				if (!event._constructed) {
					return;
				}
				this.selectedFood = food;
				this.$refs.food.show();
			},
			selectedFood() {
				console.log();
			},
			// 滚动函数
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					// 启用点击事件
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					click: true,
					// 探针检测滚动Y位置
					probeType: 3
				});
				// 监听滚动事件Y位置
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				// console.log(this.scrollY);
				});
			},
			// 计算滚动位置 和menu联动
			_calculateHeight() {
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					// clientHeight返回元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。
					height += item.clientHeight;
					this.listHeight.push(height);
				}
				console.log(this.listHeight);
			},
			// d调用实例方法（父组件相当于传递作用，获取一个组件dom，调用另一个组件方法将dom传入）
			addFood(target) {
				this._drop(target);
			},
			_drop(target) {
				// 防止快速多次点击时动画卡，异步执行动画
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);
				});
			}
		},
		components: {
			shopcart,
			cartcontrol,
			food
		}
		//  2.0废除接收子组件事件
		// events: {
		// 	 获取自组建dom
		// 	'cart.add'(target) {
		// 		 调用其它方法（取出dom）
		// 		this._drop(target);
		// 	}
		// }
	};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.goods
		display: flex
		position: absolute
		top: 174px
		width: 100%
		bottom: 46px
		// 禁止滚动
		z-index: -2
		// 超出隐藏的话手机测试底部空白把购物车挡住
		// overflow: hidden
		.menu-wapper
			flex: 0 0 80px
			// width 还要设置，要不会有兼容性问题,左侧固定，右侧自适应
			width: 80px
			background: #f3f5f7
			.menu-item
				// 垂直居中最好布局，无论内容是一行还是两行
				display: table
				height: 54px
				width: 56px
				padding: 0 12px
				line-height: 14px
				&.current
					positon: relative
					margin-top: -1px
					z-index: 10
					background: #fff
					font-weight: 700
					.text
						border-none()
				.icon
					display: inline-block
					vertical-align: top
					width: 12px
					height: 12px
					margin-right: 2px
					background-size: 12px
					backgroung-repeat: no-repeat
					// 父样式的子样式
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.special
						bg-image('special_3')
					&.invoice
						bg-image('invoice_3')
				.text
					// 对应父元素table布局
					display: table-cell
					width: 56px
					vertical-align: middle
					border-1px(rgba(7,17,27,0.1))
					font-size: 12px
					
		.foods-wrapper
			flex: 1
			.title
				paddin-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rgb(147,153,159)
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7,17,27,0.1))
				// 列表最后一个关闭bordder-1px
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7,17,27)
					.desc, .extra
						font-size: 10px
						color: rgb(147,153,159)	
					.desc
						line-height: 12px
						margin-bottom: 8px			
					.extra
						line-height: 10px
						font-size: 0
						.count, .rating
							font-size: 10px
						.count
							margin-right: 12px
						
					.price
						font-weight: 700
						line-height: 24px
						// 去除间隙
						font-size: 0
						.now
							margin-right: 18px
							font-size: 14px
							color: rgb(240,20,20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147,153,159)	
					.cartcontrol-wrapper
						position: absolute
						right: 0		
						bottom: 12px
							
						

</style>
