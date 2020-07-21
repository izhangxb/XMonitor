const XMonitor = {};
let options = {}
let handleData = void 0;

XMonitor.init = (config, callback) => {
    let {url, timeout, appId} = config;
    handleData = callback;

    if (!url) {
        throw new Error("请设置上报地址")
    }

    options = {url, timeout, appId};

    bindEvent();
}

//绑定采集事件
const bindEvent = () => {
    const tempOnload = window.onload;
    window.onload = e => {
        if (tempOnload && typeof tempOnload === "function") {
            tempOnload(e);
        }

        if (window.requestIdleCallback) {
            window.requestIdleCallback(collectData);
        } else {
            setTimeout(collectData);
        }
    }
}

const collectData = () => {
    let pageTime = collectPageTime();
    let resourceTime = collectResourceTime();
    let appId = options.appId;
    let result = {appId, pageTime, resourceTime}

    if (handleData) {
        handleData(result);
    } else {
        uploadData(result);
    }
}

//采集页面相关时间指标
const collectPageTime = () => {
    let navigationTiming = performance.getEntriesByType('navigation')[0];
    let {
        fetchStart,
        domainLookupStart,
        domainLookupEnd,
        connectStart,
        connectEnd,
        responseStart,
        responseEnd,
        domInteractive,
        domContentLoadedEventEnd,
        domComplete,
    } = navigationTiming;

    let pageTime = {};
    //首字节时间
    pageTime.ttfbTime = Math.round(responseStart - fetchStart);
    //dns查询时间
    pageTime.dnsTime = Math.round(domainLookupEnd - domainLookupStart);
    //tcp连接耗时
    pageTime.tcpTime = Math.round(connectEnd - connectStart);
    //request请求耗时
    pageTime.reqTime = Math.round(responseEnd - responseStart);
    //解析dom树耗时
    pageTime.analysisTime = Math.round(domComplete - domInteractive);
    //白屏时间
    pageTime.blankTime = Math.round(domInteractive - fetchStart);
    //首屏时间
    pageTime.domReadyTime = Math.round(domContentLoadedEventEnd - fetchStart);

    return pageTime;
}

//采集资源相关时间指标
const collectResourceTime = () => {
    let resourceTiming = performance.getEntriesByType('resource');
    let resourceTime = {};

    let threshold = options.timeout;
    resourceTiming.map(item => {
        let type = item.initiatorType;
        if (typeof resourceTime[type] !== "object") {
            resourceTime[type] = [];
        }
        if (threshold) {
            if (item.duration > threshold) {
                resourceTime[type].push(getResourceItem(item));
            }
        } else {
            resourceTime[type].push(getResourceItem(item));
        }
    })

    return resourceTime;
}

const getResourceItem = (item) => {
    let {initiatorType, duration, name, encodedBodySize, decodedBodySize} = item;

    let resourceItem = {};
    //资源类型
    resourceItem.type = initiatorType;
    //资源类型
    resourceItem.loadTime = Math.round(duration);
    //资源类型
    resourceItem.name = name;
    //资源压缩前大小
    resourceItem.encodedBodySize = encodedBodySize;
    //资源压缩后大小
    resourceItem.decodedBodySize = decodedBodySize;

    return resourceItem;
}

//上报统计数据
const uploadData = (result) => {
    let url = options.url;

    url = url + "?param=" + encodeURIComponent(JSON.stringify(result))

    let i = new Image();
    i.onload = i.onerror = i.onabort = function () {
        i = i.onload = i.onerror = i.onabort = null;
    }
    i.src = url;
}


export default XMonitor


