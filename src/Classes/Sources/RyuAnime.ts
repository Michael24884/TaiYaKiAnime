import qs from 'qs';
import cheerio from 'react-native-cheerio';
import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class RyuAnime extends SourceAbstract {
    language: TaiyakiSourceLanguage = 'English';

    source: TaiyakiSourceTypes = 'RyuAnime';

    baseUrl = 'https://ryuanime.com';

    options = { hasCloudflare: false, name: 'RyuAnime'};

    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const params = qs.stringify({
        	'search': title
    	})
        const link = `https://ryuanime.com/browse-anime?${params}`
        const html = await (await fetch(link)).text()
        const $ = cheerio.load(html)
        const results = $('li.list-inline-item:has(p.anime-name):has(a.ani-link)').toArray().map(result => {
            return {
                title: $(result).find('p.anime-name').text(),
                embedLink: 'https://ryuanime.com' + $(result).find('a.ani-link').attr('href'),
                image: $(result).find('img').attr('src')
            }
        })
        return results
    }

    async availableEpisodes(link: string): Promise<string[]> {
		const html = await (await fetch(link)).text()
        const $ = cheerio.load(html)
        return $('li.jt-di > a').toArray().map(episode => {
            return 'https://ryuanime.com' + $(episode).attr('href')
        }).reverse()
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
		const getLink = (host, id) => {
            const hosts = {
                'trollvid': `https://trollvid.net/embed/${id}`,
                'mp4upload': `https://mp4upload.com/embed-${id}.html`,
                'xstreamcdn': `https://xstreamcdn.com/v/${id}`
            }
            if (hosts.hasOwnProperty(host)) {
                return hosts[host]
            } else {
                return false
            }
        }
        const html = await (await fetch(episodeLink)).text()
        const sources = JSON.parse(html.match(/let.*?episode.*?videos.*?(\[\{.*?\}\])/)[1]).map(source => {
            const link = getLink(source.host, source.id)
            if (link != false) {
                return {
                    link,
                    server: source.host,
                    type: source.type
                }
            }
        })
        return sources
    }
}

export default RyuAnime;
