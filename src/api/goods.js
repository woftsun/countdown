import { createTimeStr, mstoken, sign } from "../utils/X-Bogus"
import useRequest from "../utils/useRequest"

const { get, post } = useRequest()
const baseUrl = process.env.PLASMO_PUBLIC_BASEURl
console.log(baseUrl)
const createBogus = (params) => {
  return sign(new URLSearchParams(params).toString(), navigator.userAgent)
}

// 关闭i订阅
export const closeConnect = async (clientId) => {
  const url = process.env.PLASMO_PUBLIC_SSE + "/sse/sse/closeConnect"
  const params = { clientId }
  return await get(url, null, params)
}

// 获取店铺信息
export const getShopData = async (cookies) => {
  const url = "https://fxg.jinritemai.com/common/index/index"
  const params = {
    appid: 1,
    _: Date.now()
  }
  return await get(url, cookies, params)
}

// 获取该店铺的活动信息
export const getCampaignData = async (cookies) => {
  let params = {
    appid: 1,
    _: Date.now(),
    campaign_status: 2,
    shop_stype: "",
    bid: "ecom_market_shop",
    page: 1,
    pageSize: 20,
    msToken: mstoken()
  }
  console.log(createBogus(params))
  params["X-Bogus"] = createBogus(params)
  const url =
    "https://fxg.jinritemai.com/marketing/promotion/v1/listFlashWithTimeLimit"
  return await get(url, cookies, params)
}

// 获取活动下的商品信息

export const getFlashGoods = async (id, cookies) => {
  const url =
    "https://fxg.jinritemai.com/byteshop/promotion/detailFlashAndGoods"
  let params = {
    campaign_id: id,
    filter_unable_product: 0,
    _bid: "ecom_market_shop",
    appid: 1,
    _: Date.now(),
    msToken: mstoken()
  }
  params["X-Bogus"] = createBogus(params)
  return await get(url, cookies, params)
}

export const transitGoods = async (data) => {
  const url = baseUrl + "/discov/limitPurchase/addGoods"
  return await post(url, null, data)
}

export const transitLiveInfo = async (data) => {
  const url = baseUrl + "/discov/limitPurchase/liveInformation"
  return await post(url, null, data)
}

// 检查库存

export const checkStock = async (cookies, data) => {
  const url =
    "https://fxg.jinritemai.com/marketing/promotion/v1/checkFlashAndGoods"
  const params = {
    _bid: "ecom_market_shop",
    appid: 1,
    _: Date.now(),
    msToken: mstoken()
  }
  params["X-Bogus"] = createBogus(params)

  return await post(url, cookies, data, params)
}

// 调整库存
export const setStock = async (cookies, data) => {
  const url =
    "https://fxg.jinritemai.com/marketing/promotion/v1/editFlashAndGoods"
  const params = {
    _bid: "ecom_market_shop",
    appid: 1,
    _: Date.now(),
    msToken: mstoken()
  }
  params["X-Bogus"] = createBogus(params)

  return await post(url, cookies, data, params)
}

// 没有activeId时调整库存
export const newSetStock = async (cookies, data) => {
  const url = "https://fxg.jinritemai.com/byteshop/promotion/editFlashAndGoods"
  const params = {
    _bid: "ecom_market_shop",
    appid: 1,
    _: Date.now(),
    msToken: mstoken()
  }
  params["X-Bogus"] = createBogus(params)

  return await post(url, cookies, data, params)
}

// 库存失败通知
export const adjustMsg = async (data) => {
  const url = baseUrl + "/discov/msgSend/adjust-goods-inventory"
  return await post(url, null, data)
}
