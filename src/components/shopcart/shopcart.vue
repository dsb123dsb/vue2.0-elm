<template>
	<div class="shopcart">
		<div class="content">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo">
						<i class="icon-shopping_cart"></i>
					</div>
				</div>
				<div class="price">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right">
				<div class="pay">￥{{minPrice}}起送</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			selectFoods: {
				type: Array,
				default() {
					return [];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.count * food.price;
				});
				return total;
			}
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px
		.content
			display: flex
			background: #141d27
			font-size: 0
			color: rgba(255,255,255,0.4)
			.content-left
				flex: 1
				.logo-wrapper
					display: inline-block
					// flex子元素中verticla-align失效。但是子元素的子元素可以
					vertical-align: top
					// 相对定位才可以撑开父元素
					position: relative
					top: -10px
					margin: 0 12px
					padding: 6px
					width: 56px
					height: 56px	
					box-sizing: border-box
					border-radius: 50%	
					background: #141d27	
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						text-align: center
						background: #2b343c
						// 图标是字体
						.icon-shopping_cart
							line-height: 44px
							font-size: 24px
							color: #80858a
				.price
					display: inline-block
					vertical-align: top
					margin-top: 12px
					line-height: 24px
					padding-right: 12px
					box-sizing: border-box
					border-right: 1px solid rgba(255,255,255,0.1)
					font-size: 16px
					font-weight: 700
				.desc
					display: inline-block
					vertical-align: top
					margin: 12px 0 0 12px
					line-height: 24px
					font-size: 10px
			.content-right
				flex: 0 0 105px
				widht: 105px
				background: #2b343c
				.pay
					height: 48px
					line-height: 48px
					text-align: center
					font-weight: 700
					font-size: 12px				
</style>
