import qs from 'qs';
import cheerio from 'react-native-cheerio';
import { TaiyakiSourceTypes, TaiyakiSourceLanguage } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class TioAnime extends SourceAbstract {
    baseUrl: string = 'https://tioanime.com';
    source: TaiyakiSourceTypes = 'TioAnime';
    language: TaiyakiSourceLanguage = 'Spanish';
    options: { hasCloudflare: boolean; name: string} = {hasCloudflare: false, name: 'Tio Anime'};
    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const params = qs.stringify({q: title});
        const response = await (await fetch(this.baseUrl + '/directorio?' + params, {signal: this.signal})).text();
        const $ = cheerio.load(response);
        return $('article.anime')
        .toArray()
        .map((e: any) => {
            const title = $(e)
            .find('h3.title')
            .text();
            console.log('the title', title)
            const link = $(e)
            .find('a')
            .attr('href');
            console.log('the link', link)
            const image = $(e)
            .find('img')
            .attr('src');
            return {title, image: this.baseUrl + image, embedLink: this.baseUrl + link};
        });
    }
    
    async availableEpisodes(link: string): Promise<string[]> {
        
        const response = await (await fetch(link, {signal: this.signal})).text();
        const $ = cheerio.load(response);
        const script: string = $('script').last().html();
            const info = script.match(/anime_info = (\[.+\])/);
        const episodes = script.match(/episodes = (\[.+\])/);
        if (info && episodes) {
            const slug = (info[1].split(','))[1].match(/[A-Za-z0-9-]+/)![0];
            const links: number[] = (episodes[1]).substring(1, episodes[1].length -1).split(',').map((i) => Number(i));
            return links.map((i) => this.baseUrl + '/ver/' + slug + '-' + i).reverse();
        }
        throw new Error('Not yet configured');
    }
   
   async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
        const response = await (await fetch(episodeLink, {signal: this.signal})).text();
        const $ = cheerio.load(response);
        const script: string = $('script')
        .last()
        .prev()
        .html();

        const arrays = script.match(/\[.+\]/);
        if (arrays) {
            const data = decodeURI(arrays[0]);
            const reg = new RegExp(/\["(\w+)"/g);
            const linkReg = new RegExp(/"(https:[^"]+)/g);
            // const names = data.matchAll(reg);
            const items = [...data.matchAll(reg)];
            const links = [...data.matchAll(linkReg)]
            const embed = [];
            for (let i = 0; i < items.length; i++) {
                const server = items[i][1];
                const link = links[i][1].replace(/\\/g, '');
                embed.push({server, link});
            }

            return embed;
        }
        return [];
    }
}

export default TioAnime;
