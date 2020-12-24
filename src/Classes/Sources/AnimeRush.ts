import qs from 'qs';
import cheerio from 'react-native-cheerio';
import { TaiyakiSourceTypes, TaiyakiSourceLanguage } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class AnimeRush extends SourceAbstract {
    baseUrl: string = 'https://www.animerush.tv';
    source: TaiyakiSourceTypes = 'AnimeRush';
    language: TaiyakiSourceLanguage = 'English';
    options: { hasCloudflare: boolean; name: string; } = {hasCloudflare: false, name: 'AnimeRush'};
    
    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const params = qs.stringify({searchparams: title});
        const response = await (await fetch(this.baseUrl + '/search.php?search' + params, {signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        return $('div.amin_box_mid > div.search-page_in_box_mid_link')
        .toArray()
        .map((e: any) => {
            const title = $(e)
            .find('h4')
            .text();
            const image = $(e)
            .find('div.anime-search-image > object')
            .attr('data');
            const link = $(e)
            .find('a')
            .attr('href');
            return {title, image: 'https:' + image, embedLink: 'https:' + link};
        });
    }

    async availableEpisodes(link: string): Promise<string[]> {
        const response = await (await fetch(link, {headers: this.headers, signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        return $('div.desc_box_mid > div.episode_list')
        .toArray()
        .map((e: any) => {
            const link = $(e)
            .find('a')
            .attr('href');
            return 'https:' + link;
        });
        
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
        const response = await (await fetch(episodeLink, {signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        const singleLink =  $('div.videoembed.activeembed > #mp4sd')
        const server = $(singleLink).attr('title');
        const link = $(singleLink).attr('src');

        //TODO: Return all available sources. 
        //This requires requesting a new page, causing potential overhead.
        return [{server, link}];
    }

}

export default AnimeRush;
