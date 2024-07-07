class Scraper {
  constructor() {
    return this
  }

  async fetch(url) {
    this.url = url
    this.response = await fetch(url)

    const server = this.response.headers.get('server')

    const isThisWorkerErrorNotErrorWithinScrapedSite = (
      [530, 503, 502, 403, 400].includes(this.response.status) &&
      (server === 'cloudflare' || !server /* Workers preview editor */)
    )

    if (isThisWorkerErrorNotErrorWithinScrapedSite) {
      throw new Error(`Status ${ this.response.status } requesting ${ url }`)
    }

    return this
  }

  async getRaw(){
    return this.response.text();
  }
}

export default Scraper
