<template>
	<view class="content">
		<u-modal closeOnClickOverlay :show="shareCoverShow" @close="closeShareCoverTap()">
			<view slot="default" class="show_cover_modal" @click="previewImage()">
				<image :src="tempFilePath" mode="widthFix"></image>
			</view>
			<view class="show_button_box" slot="confirmButton">
				<view class="card_button" @click="closeShareCoverTap()">关闭</view>
				<view class="card_button card_save" @click="saveShareCoverTap">保存海报</view>
			</view>
		</u-modal>

		<block v-if="qrcodePic">
			<l-painter isCanvasToTempFilePath @success="toTempFilePath" :sleep="100" :after-delay="1000"
				custom-style="position:fixed;left:1000%;" css="width:700rpx;height:1300rpx;" ref="shareCoverPic">
				<l-painter-view
					:css="{width:'700rpx',height:'1300rpx',position:'relative',backgroundColor:'#fff',overflow:'hidden'}">
					<l-painter-image src="../../static/images/bgc-img.png"
						css="width:100%;height:100%;object-fit:fill;object-position:center top;position:absolute;">
					</l-painter-image>
					<!-- 头部图片 -->
					<l-painter-view css="text-align:center;display:inline-block;width:100%;padding-top:90rpx;">
					<l-painter-text :text="shopInfo.shop_name" css="font-size: 40rpx;color:#00bf69;display:inline-block;width:100%;text-align:center;"></l-painter-text>
					</l-painter-view>
					<l-painter-image :src="bannerPic"
						css="width:560rpx;height:550rpx;border: 3rpx solid #ededee;object-fit:cover;object-position:center ;position:absolute;top:210rpx;left:70rpx;">
					</l-painter-image>
					<!-- 商品介绍 -->
					<l-painter-view css="position:absolute;padding-top:26rpx;top:760rpx;width:560rpx;left:70rpx;">
						<l-painter-text :text="goodsData.title"
							:css="{color: '#1c1c1c',fontSize: '36rpx', fontWight: 'bold', width: '100%', lineClamp: 1}">
						</l-painter-text>
						<l-painter-text v-if="goodsData.introduce" :text="goodsData.introduce"
							:css="{color: '#1c1c1c',fontSize: '30rpx',width: '100%', lineClamp: 1, fontWight: 'normal'}">
						</l-painter-text>
						<l-painter-text  v-else text="味道香甜"
							:css="{color: '#ffffff',fontSize: '30rpx', width: '100%', lineClamp: 1, fontWight: 'normal'}">
						</l-painter-text>
						<l-painter-view css="line-height:50rpx;">
							<!-- 库存 -->
							<l-painter-view css="display:inline-block;width:60%;">
								<l-painter-text
									:text="goodsData.stock_number>10?'库存充足': `库存仅剩${goodsData.stock_number||0}${goodsData.goods_unit||'件'}`"
									:css="{color: goodsData.stock_number>10?'#19be6b':'#da0a79',fontSize: '30rpx',lineClamp: 2}">
								</l-painter-text>
							</l-painter-view>
							<!-- 价格 -->
							<l-painter-view
								css="text-align:right;display:inline-block;width:40%;vertical-align:bottom;">

								<l-painter-text text="¥"
									css="color:#fe4747;font-size:28rpx;margin-top:8rpx;padding-right:4rpx;">
								</l-painter-text>
								<l-painter-text :text="goodsData.mini_price"
									css="color:#fe4747;font-size:46rpx;font-weight:bold;"></l-painter-text>
								<l-painter-text text="起"
									css="color:#777891;font-size:28rpx;padding-left:6rpx;margin-top:8rpx;">
								</l-painter-text>
							</l-painter-view>
						</l-painter-view>
					<!-- 	<l-painter-view css="width:650rpx;border-bottom:5rpx dashed #75a52d;padding-top:50rpx"></l-painter-view> -->
						<l-painter-view css="padding-top:50rpx;">
							<l-painter-view css="text-align:left;width:40%;display:inline-block;">
								<l-painter-image :src="qrcodePic" css="width:180rpx;height:180rpx;"></l-painter-image>
							</l-painter-view>
							<l-painter-view css="width:60%;display:inline-block;">
								<l-painter-text text="①扫描或长按识别二维码\r\n②查看商品详情"
									css="color:#383838;font-size:30rpx;margin-top:50rpx;"></l-painter-text>
							</l-painter-view>
							
						</l-painter-view>
					</l-painter-view>
				</l-painter-view>
			</l-painter>
		</block>

	</view>
</template>

<script>
	export default {
		props: {
			goodsData: {
				type: Object,
				value: {}
			}
		},
		data() {
			return {
				shopInfo: uni.getStorageSync('__ddminiShopInfo'),
				shareCoverShow: false,
				tempFilePath: '',
				qrcodePic: '',
				bannerPic: '',
			};
		},
		onReady() {
			let self = this;
			let user = uni.getStorageSync('__ddminiUserData');
			let scene = `g=${self.goodsData.id}`;
			if (user.profitsharing) {
				scene = `g=${self.goodsData.id},f=${user.id}`;
			}
			let qrData = {
				scene: scene,
				page: 'pages/index/index',
				dtime: 1
			}
			let sics = self.goodsData.pic_list[0].pic.replace(/http:/g, 'https:');
			self.bannerPic = sics;
			uni.showLoading({
				title: '海报绘制中',
				mask: true
			});
			self.qrcodePic = 'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/gh_33446d7f7a26_430.jpg';
			// console.log(self.bannerPic, self.qrcodePic)
			// self.Post(self.Url.qrcodeWechat, qrData).then(res => {
			// 	if(res.code === 0){
			// 		self.qrcodePic = res.url;
			// 	}else{
			// 		uni.hideLoading();
			// 		uni.showModal({
			// 			title: '绘制失败',
			// 			content: res.msg,
			// 			showCancel: false
			// 		})
			// 	}
			// })
		},
		methods: {
			saveShareCoverTap() {
				let self = this;
				uni.saveImageToPhotosAlbum({
					filePath: self.tempFilePath,
					success: function() {
						self.closeShareCoverTap();
						uni.showToast({
							title: '保存成功'
						});
					}
				});
			},
			toTempFilePath(path) {
				uni.hideLoading();
				this.tempFilePath = path;
				this.shareCoverShow = true;
			},
			fail(e) {
				console.log(e)
			},
			previewImage() {
				let self = this;
				uni.previewImage({
					urls: [self.tempFilePath],
					current: self.tempFilePath
				});
			},
			closeShareCoverTap() {
				this.$emit('closeShare', true);
			}
		}
	};
</script>

<style lang="scss">
	// .data-v-713d0fd3
	.show_cover_modal {
		width: 100%;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width: 100%;
			border-radius: 10rpx;
			overflow: hidden;
		}
	}

	.show_button_box {
		display: flex;
		justify-content: center;

		.card_button {
			border: 1px solid #fe4747;
			color: #fe4747;
			font-size: 30rpx;
			padding: 10rpx 50rpx;
			border-radius: 10rpx;
		}

		.card_save {
			margin-left: 50rpx;
			background-color: #fe4747;
			color: #fff;
		}
	}
</style>
