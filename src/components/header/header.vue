<template>
    <!-- 动态绑定v-bind:seller缩写:seller v-on:click=缩写@click= -->
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<!-- 不能直接用src -->
				<img width="64" height="64" :src="seller.avatar" alt="">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}
				</div>
				<div v-if="seller.supports" class="support" @click="showDetail">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>

		<div class="bulletin-wrapper" @click="showDetail">
			<!-- 同行消除inline-block带来的间隙 -->
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<!-- 设置背景图片，父元素设置background-image无法设置模糊 -->
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<!-- 浮层 -->
		<transition name="fade">
			<div v-show="detailShow" class="detail">
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<h1 class="name">{{seller.name}}</h1>
						<div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>
						<!-- flex弹性布局，line自适应（可以封装为组件） -->
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<!-- 列表循环vue2.0和1.0不同 -->
							<li v-for="(item,index) in seller.supports" class="support-item">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="text">{{seller.supports[index].description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>											
					</div>
				</div>
				<div class="detail-close" @click="hideDetail">
					<i class="icon-close"></i>
				</div>
			</div>			
		</transition>

	</div>
</template>

<script type="text/ecmascript-6">
	import star from '@/components/star/star';

	export default {
	// 钩子 父组件中绑定设置的seller
	props: {
		seller: {
			type: Object
		}
		},
		// 子组件数据
		data () {
			return {
				detailShow: false
			};
		},
		// 方法.(1.2现实消失模态框)
		methods: {
			showDetail () {
				this.detailShow = true;
		},
			hideDetail () {
				this.detailShow = false;
			}
		},
		created () {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		},
		// 前面引入后，父组件内注册子组件组件名不能使用html内置标签
		components: {
			star
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin"
	.header
		position: relative
		// 否则fiter: bulr会溢出header
		overflow: hidden
		color: #fff
		background: rgba(7,17,27,0.5)
		.content-wrapper
			position: relative
			padding: 24px 12px 18px 24px
			// 消除inline-block时产生的间隙
			font-size: 0
			.avatar
				display: inline-block
				vertical-align: top
				img
					border-radius: 2px
			.content
				display: inline-block
				margin-left: 16px
				font-size: 14px
				.title
					margin: 2px 0 8px 0
					.brand
						// 内联元素无法设置宽高
						display: inline-block
						// 把元素的顶端与行中(行高18)最高元素的顶端对齐
						vertical-align: top
						width: 30px 
						height: 18px
						bg-image('brand')
						background-size: 30px 18px
						background-repaet: no-repeat
					.name
						margin-left: 6px
						line-height: 18px
						font-size: 16px				
						font-weight: bold
				.description
					margin-bottom: 10px
					line-height: 12px
					font-size: 12px
				.support
					.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 4px
						background-size: 12px
						backgroung-repeat: no-repeat
						// 父样式的子样式
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.special
							bg-image('special_1')
						&.invoice
							bg-image('invoice_1')
					.text
						vertical-align: top
						line-height: 12px
						font-size: 10px
			.support-count
				position: absolute
				right: 12px
				bottom: 16px
				padding: 0 8px
				height: 24px
				line-height: 24px
				border-radius: 14px
				background: rgba(0,0,0,0.2)
				text-align: center
				.count
					vertical-align: top
					font-size: 10px
				.icon-keyboard_arrow_right
					margin-left: 2px
					line-height: 24px
					font-size: 10px
		.bulletin-wrapper
			position: relative
			height: 28px
			line-height: 28px
			padding: 0 22px 0 12px
			// 折叠行 空白被合并
			white-space: nowrap
			// 超出父元素隐藏
			overflow: hidden
			// 。。。。效果，需要前面两个组合设置
			text-overflow: ellipsis
			// 设置为0时。文本中省略号会消失。可在html中让两个span同行，来消除inlin-block带来的空白
			// font-size: 0	
			background: rgba(7,17,27,0.2)
			.bulletin-title
				display: inline-block
				margin-top: 8px
				vertical-align: top
				width: 	22px
				height: 12px
				bg-image('bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat			
			.bulletin-text
				vertical-align: top
				margin: 0 4px
				font-size: 10px	
			.icon-keyboard_arrow_right
				position: absolute
				font-size: 10px
				right: 12px
				top: 8px
		.background
			position: absolute		
			left: 0
			top: 0
			width: 100%
			height: 100%
			z-index: -1
			// 背景图模糊
			filter: blur(10px)
		.detail
			position: fixed
			z-index: 100
			// 不设置top left不会全屏显示
			top: 0
			left: 0
			width: 100%
			height: 100%
			overflow: auto
			background: rgba(7,17,27,0.8)
			// 背景模糊，尽在ios生效
			backdrop-filter: blur(10px)
			// css3动画vue2.0和1.0不同，模态框渐变出现
			&.fade-enter-active, &.fade-leave-active
				transition: all 0.5s
				background: rgba(7,17,27,0.8)
			&.fade-enter, &.fade-leave-active
				opacity: 0
				background: rgba(7,17,27,0)
			// sticky-footer布局，关闭部分不会遮挡内容
			.detail-wrapper
				min-height: 100%
				width: 100%
				.detail-main
					margin-top: 64px
					padding-bottom: 64px
					.name
						line-height: 16px
						text-align: center
						font-size: 16px
						font-weight: 700
					.star-wrapper
						margin-top: 18px
						padding: 2px 0
						text-align: center
					// flex弹性布局，line自适应 Postcss can i use 做兼容处理
					.title
						display: flex
						width: 80%
						margin: 28px auto 24px auto
						.line
							flex: 1
							position: relative
							top: -6px
							border-bottom: 1px solid rgba(255,255,255,0.2)
						.text
							padding: 0 12px
							font-weight: 700
							font-size: 14px
					.supports
						width: 80%
						margin: 0 auto
						.support-item
							padding: 0 12px
							margin-bottom: 12px
							font-size: 0
							&:last-child
								margin-bottom: 0
							.icon
								display: inline-block
								width: 16px
								height: 16px
								vertical-align: top
								margin-right: 6px
								background-size: 16px
								background-repeat: no-repeat
								&.decrease
									bg-image('decrease_1')
								&.discount
									bg-image('discount_1')
								&.guarantee
									bg-image('guarantee_1')
								&.special
									bg-image('special_1')
								&.invoice
									bg-image('invoice_1')
							.text
								line-height: 16px
								font-size: 12px	
					.bulletin
						width: 80%
						margin: 0 auto
						.content
							padding: 0 12px
							line-height: 24px
							font-size: 12px											
			.detail-close
				position: relative
				width: 32px
				height: 32px
				margin: -64px auto 0 auto
				clear: both
				font-size: 32px
				
			
</style>
