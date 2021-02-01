import qs from 'qs';
import cheerio from 'react-native-cheerio';
import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class TenshiMoe extends SourceAbstract {
    language: TaiyakiSourceLanguage = 'English';
    
    source: TaiyakiSourceTypes = 'TenshiMoe';
        
    baseUrl = 'https://tenshi.moe/';
    
    options = { hasCloudflare: false, name: 'Tenshi.Moe'};
	
    
    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const params = qs.stringify({
            'q': title
        })
        const link = `https://tenshi.moe/anime?${params}`
        const html = await (await fetch(link)).text()
        const $ = cheerio.load(html)
        return $('ul.loop.anime-loop.list > li > a').toArray().map(result => {
            return {
                title: $(result).attr('title'),
                embedLink: $(result).attr('href'),
                image: null
            }
        })
    }

    async availableEpisodes(link: string): Promise<string[]> {
        const html = await(fetch(link).then(html => html.text()))
        const $ = cheerio.load(html)
        return $('li[class^=episode] > a').toArray().map(episode => $(episode).attr('href'))
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
		const html = await (await fetch(episodeLink)).text()
        const $ = cheerio.load(html)
        return $('video#player > source').toArray().map((source) => {
            return {
                link: $(source).attr('src'),
                server: `Tenshi.Moe-${$(source).attr('title')}`
            }
        })
    }
}

export default TenshiMoe;
