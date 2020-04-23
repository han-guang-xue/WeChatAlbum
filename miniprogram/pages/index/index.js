Page({
    data: {
        user: null
    },

    onLoad: function() {
        console.log("123")
        let that = this;
        wx.login({
            timeout: 10000,
            success: (result) => {
                console.log(result)
            },
            fail: () => {},
            complete: () => {}
        });
        wx.getUserInfo({
            withCredentials: false,
            lang: 'zh_CN',
            timeout: 10000,
            success: (result) => {
                console.log(result)
                console.log(result.encryptedData)
                console.log(result.iv)
                console.log(JSON.parse(result.rawData))
                that.setData({
                    user: JSON.parse(result.rawData)
                })
            },
            fail: () => {},
            complete: () => {}
        });
    }

})