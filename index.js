import Scraper from './scraper.js'
import { generateJSONResponse, generateErrorJSONResponse } from './json-response.js'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const searchParams = new URL(request.url).searchParams

  const apikey = searchParams.get('apikey')

  if(apikey !== API_KEY){
    return generateErrorJSONResponse("incorrect api key", false)
  }

  const pretty = searchParams.get('pretty')

  let url = searchParams.get('url')
  if (url && !url.match(/^[a-zA-Z]+:\/\//)) url = 'http://' + url

  return handleAPIRequest({ url, pretty })
}

async function handleAPIRequest({ url, pretty }) {
  let scraper, result

  try {
    scraper = await new Scraper().fetch(url)
  } catch (error) {
    return generateErrorJSONResponse(error, pretty)
  }

  try {
    result = await scraper.getRaw()
  } catch (error) {
    return generateErrorJSONResponse(error, pretty)
  }

  return generateJSONResponse({ result }, pretty)
}
