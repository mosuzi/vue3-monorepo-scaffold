export function camel2Dash(camel: string) {
  return camel.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export function dash2Camel(dash: string, pascal: boolean = false) {
  if (dash) {
    if (pascal) {
      const data = dash.trim()
      dash = data.replace(data[0], data[0].toUpperCase())
    }
    return dash.replace(/-(.)/gi, (m, p1) => {
      return p1.toUpperCase()
    })
  }
  return ''
}

export function validHttp(link: string) {
  const startsWithHttp = new RegExp('^https?://.*w+')
  return link && startsWithHttp.test(link)
}

export function combineURLs(baseURL: string, relativeURL: string = '') {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

export function concatLinkStr(
  baseUrl: string,
  query: Record<string, unknown> = {},
  subPath: string = ''
) {
  if (!baseUrl) return
  let questionMarkPosition = baseUrl.indexOf('?')
  if (questionMarkPosition < 0) questionMarkPosition = Infinity
  const path = combineURLs(baseUrl.slice(0, questionMarkPosition), subPath)
  query = Object.assign(
    {},
    baseUrl
      .slice(questionMarkPosition + 1)
      .split('&')
      .reduce((map: Record<string, unknown>, kvStr: string) => {
        let assignMarkPosition = kvStr.indexOf('=')
        if (assignMarkPosition < 0) assignMarkPosition = Infinity
        map[kvStr.slice(0, assignMarkPosition)] = kvStr.slice(assignMarkPosition + 1)
        return map
      }, {}),
    query
  )
  return (
    path +
    '?' +
    Object.keys(query)
      .filter(k => k)
      .map(k => k + '=' + query[k])
      .join('&')
  )
}

export function dash2Pascal(dash: string) {
  return dash2Camel(dash, true)
}

export function splitNumber(num: number | string, splitter: string = ',') {
  const numArr = ('' + num).split('')
  numArr.reverse()
  const res = Array<string>()
  numArr.forEach((n, index) => {
    res.push(n)
    if ((index + 1) % 3 === 0 && index + 1 !== numArr.length) {
      res.push(splitter)
    }
  })
  res.reverse()
  return res.join('')
}

export function color2Rgb(color: string) {
  let sColor = color.toLowerCase()
  //十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //处理六位的颜色值
    const sColorChange = Array<number>()
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return sColorChange.join(',')
  }
  return sColor
}
