<template>
	<div class="goods">
		<div class="menu-wapper">
	
		</div>
		<div class="foods-wrapper">
			
		</div>
	</div>

</template>

<script type="text/ecmascript-6">
	const ERR_OK = 0;

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: []
			};
		},
		created() {
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					console.log(this.goods);
				}
			});
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.goods
		display: flex
		position: absolute
		top: 174px
		width: 100%
		bottom: 46px
		overflow: hidden
		.menu-wapper
			flex: 0 0 80px
			// width 还要设置，要不会有兼容性问题,左侧固定，右侧自适应
			width: 80px
			background: #f3f5f7
			
		.foods-wrapper
			flex: 1
			
</style>
