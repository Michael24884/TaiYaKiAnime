import qs from "qs";
import cheerio from 'react-native-cheerio';
import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from ".";
import { TaiyakiScrapedTitleModel } from "../../Models";
import SourceAbstract from "./SourceAbstract";

class FourAnime extends SourceAbstract {
    
    baseUrl: string = 'https://4anime.to';
    source: TaiyakiSourceTypes = 'FourAnime';
    language: TaiyakiSourceLanguage = 'English';
    options: { hasCloudflare: boolean; name: string; } = {hasCloudflare: false, name: '4Anime'};
    controller: AbortController = new AbortController();

    private headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9;imag/webp,image/apng",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Max OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36 OPR/69.0.3686.36"
    };


    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const data = 'asl_active=1&p_asl_data=qtranslate_lang%3D0%26set_intitle%3DNone%26customset%255B%255D%3Danime';
        const response = await fetch(this.baseUrl + '/?' + qs.stringify({s: title}), 
        {headers: this.headers,
         signal: this.controller.signal,
         method: 'POST',
         body: data
        });
        const _ = await response.text();
        const $ = cheerio.load(_);
        
        return $('#headerDIV_2 > #headerDIV_95').toArray().map((e: any) => {
                        const link = $(e).find('a').attr('href');
                        const title = $(e).find('div').text();
                        const image = $(e).find('img').attr('src');
                        return {
                            title,
                            image,
                            embedLink: link
                        };
                    });
    }
    
    async availableEpisodes(link: string): Promise<string[]> {
        const _response = await (await fetch(link, {headers: this.headers, signal: this.controller.signal})).text();
        const $ = cheerio.load(_response)
        return $('ul.episodes.range.active > li').toArray().map((e: any) => {
                        return $(e).find('a').attr('href');
                    });
    }
    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
        const response = await (await fetch(episodeLink, {headers: this.headers, signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        const html = $('div.mirror-footer.cl').find('script').html();
                const link = RegExp(/href=..([^\\\\]+)/);
                const match = html.match(link);
                if (match) return [{
                    server: 'Custom',
                    link: match[1]
                }];
                return [];
    }

}


export default FourAnime;
