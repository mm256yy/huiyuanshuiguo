let links = {
	/******
		* 这是API接口列表，请根据需要自行添加
		* 每一行对应一个API接口
		* 在页面可以直接使用 this.Get() 或 this.Post() 进行调用
		* 请务必注意接口的请求方式，get,post 要区分开
		* 如果接口达不到开发需求或想新增接口，请联系QQ：1172007555
	*******/
	'wechatLogin': '/api/login/wechat',
	'wechatDetail': '/api/register/wechat/detail',
	'checkToken': '/api/check/token',
	'shopInfo': '/api/shop/info',
	'agreementSearch': '/api/plugin/agreement/search',
	'agreementMessage': '/api/plugin/agreement/message',
	
	'uploadFile': '/api/overall/upload/file',
	'messageWechat': '/api/overall/message/wechat',
	'qrcodeWechat': '/api/overall/qrcode/wechat',
	'brandInfo': '/api/brand/info'
}

module.exports = {
	links: links
}