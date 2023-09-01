import cookies from "../background/messages/cookies"
import { createTimeStr, mstoken, sign } from "../utils/X-Bogus"
import useRequest from "../utils/useRequest"

const baseUrl = process.env.PLASMO_PUBLIC_BASEURl

const { get, post } = useRequest()

const createBogus = (params) => {
  console.log(sign(new URLSearchParams(params).toString(), navigator.userAgent))
  return sign(new URLSearchParams(params).toString(), navigator.userAgent)
}

export const getRoomList = async (cookies) => {
  const url =
    "https://compass.jinritemai.com/compass_api/shop/live/live_list/realtime"
  let params = {
    page_no: 1,
    page_size: 6,
    _lid: createTimeStr(),
    msToken: mstoken()
  }
  params["X-Bogus"] = createBogus(params)
  return await get(url, cookies, params)
}

export const getItemRoomData = async (cookies, room_id) => {
  let params = {
    room_id,
    _lid: createTimeStr(),
    msToken: mstoken()
  }
  params["X-Bogus"] = createBogus(params)
  const url = `https://compass.jinritemai.com/compass_api/author/live/basic_live_screen/base_info`
  return await get(url, cookies, params)
}

export const getLiveUid = async (cookies) => {
  let params = {
    verifyFp: "f1c5d38265607efe23f8f44a844346add4a0031efe38b5ad49",
    fp: "f1c5d38265607efe23f8f44a844346add4a0031efe38b5ad49",
    msToken: ""
  }
  params["X-Bogus"] = createBogus(params)
  const url = "https://buyin.jinritemai.com/index/getUser"
  return await get(url, cookies, params)
}

export const getLiveRoomId = async (cookies) => {
  let params = { msToken: mstoken(), check_released_fission_activity: false }
  params["X-Bogus"] = createBogus(params)
  const url = "https://buyin.jinritemai.com/api/anchor/livepc/playinfo"
  return await get(url, cookies, params)
}

// 使用UID交换抖音账号
export const changeDyAccount = async (id) => {
  const params = { douyinId: id }
  const url = baseUrl + "/discov/discovStudio/getDouyinAccount"
  return await get(url, {}, params)
}
