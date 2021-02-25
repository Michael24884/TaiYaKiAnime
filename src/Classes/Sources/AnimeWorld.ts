import cheerio from 'react-native-cheerio';
import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class AnimeWorld extends SourceAbstract {
    language: TaiyakiSourceLanguage = 'Italian';
    
    source: TaiyakiSourceTypes = 'AnimeWorld';
        
    baseUrl = 'https://www.animeworld.tv/';
    
    options = { hasCloudflare: false, name: 'AnimeWorld'};
    

    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const link = `https://www.animeworld.tv/search?keyword=${title}`
        const html = await (await fetch(link)).text()
        const $ = cheerio.load(html)
        return $('.film-list > .item').toArray().map(result => {
            let res = $(result)
            var title = res.find('img').attr('alt')
            var meta = []
            for (const flag of res.find('.status > div').toArray()) {
                if ($(flag).text().includes('DUB')) {
                    meta.push('Dubbed')
                } else if ($(flag).text().includes('Movie')) {
                    meta.push('Movie')
                } else if ($(flag).text().includes('Special')) {
                    meta.push('Special')
                }
            }
            if (meta.length > 0) {
                title = title + ` (${meta.join('/')})`
            }
            return {
                title: title,
                embedLink: "https://www.animeworld.tv" + res.find('a').attr('href'),
                image: res.find('img').attr('src')
            }
        })
    }

    async availableEpisodes(link: string): Promise<string[]> {
        const html = await (await fetch(link)).text()
        const $ = cheerio.load(html)
        const serverNames = $('.servers-tabs > .server-tab').toArray().map(e => {
            return $(e).text().trim()
        })
        return $('#animeId > .widget-body > .server').toArray().map((server, index) => {
            if (serverNames[index] == 'Streamtape') {
                return $(server).find('li.episode').toArray().map(e => {
                    return "https://www.animeworld.tv" + $(e).find('a').attr('href')
                })
            }
        }).filter(e => e != undefined)[0]
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
        const html = await (await fetch(episodeLink)).text()
        const $ = cheerio.load(html)
        const servers = []
        $('#external-downloads > center > a').toArray().map(s => {
            let server = $(s)
            servers.push({
                link: server.attr('href'),
                server: server.text().match(/Download (.*?) - Ep./)[1].trim().toLowerCase()
            })
        })
    }
}

export default AnimeWorld;
