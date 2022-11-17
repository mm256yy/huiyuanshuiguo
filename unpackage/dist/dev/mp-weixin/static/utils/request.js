const templateKey = 'IE2207242058061967907';
const domainLinks = uni.getSystemInfoSync().platform==='devtools'?'https://open3.api.ddyy.top':'https://sh.api.ddyy.top';//API后台地址，这个不用修改
// const domainLinks = 'https://open3.api.ddyy.top';//API后台地址，这个不用修改

function serverGet(url, data) {
    let promise = new Promise((resolve) => {
		let token = uni.getStorageSync('__ddminiUserInfo').token;
		let headers = {
			'template-key': templateKey, //模版服务码
			'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
		};
		if(token){
			headers.authorization = token;
		}
        let postData = data;
        uni.request({
            url: domainLinks+url,
            data: postData,
            method: 'GET',
			header: headers,
            success: function (res){
                resolve(res.data);
            }
        })
    });
    return promise;
}

function serverPost(url, data) {
    let promise = new Promise((resolve) => {
		let token = uni.getStorageSync('__ddminiUserInfo').token;
		let headers = {
			'template-key': templateKey, //模版服务码
			'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
		};
		if(token){
			headers.authorization = token;
		}
        let postData = data;
        uni.request({
            url: domainLinks+url,
            data: postData,
            method: 'POST',
            header: headers,
            success: function (res){
                resolve(res.data);	
            }
        })
    });
    return promise;
}

function serverUpload(url,data) {
    let promise = new Promise((resolve) => {
		let token = uni.getStorageSync('__ddminiUserInfo').token;
		let headers = {
			'template-key': templateKey, //模版服务码，所有模版必须要填写正确的模版服务码才能获取到数据
			'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序appid，当前小程序的appid必须和后台填写的appid一致才能获取到数据
			authorization: token
		};
		uni.uploadFile({
			url: domainLinks+url,
			filePath: data,
			name: 'file',
			header: headers,
			success: (res) => {
				let json = JSON.parse(res.data);
				resolve(json);
			}
		});
    });
    return promise;
}

function templateConfig() {
    let promise = new Promise((resolve) => {
        uni.request({
            url: domainLinks+'/api/template/yipins',
            method: 'GET',
            header: {
				'template-key': templateKey, //模版服务码
				'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
			},
            success: function (res){
                resolve(res.data);	
            }
        })
    });
    return promise;
}

module.exports = {
    get: serverGet,
    post: serverPost,
	upload: serverUpload,
	config: templateConfig
}