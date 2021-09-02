import axios from 'axios'
export const getCurrentCity = () => {
  const LocalCity = JSON.parse(localStorage.getItem('hkzf_city'))

  if(!LocalCity) { //如果本地存储没有城市数据
   
    return new Promise((resolve, reject) => {
      const curCity = new window.BMapGL.LocalCity()
      curCity.get(async res => {
       try {
        const result = await axios.get(`http://101.132.119.44:9090/area/info?name=${res.name}`) //只有北上广深有数据，当前没有默认上海
        
        //存储到本地存储中
        localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
        resolve(result.data.body)   
       } catch(e) {
        //获取定位城市失败
        reject(e)
       }
      })
    })
  }
  //本地存储有城市数据 也返回一个Promise
  return Promise.resolve(LocalCity)
}