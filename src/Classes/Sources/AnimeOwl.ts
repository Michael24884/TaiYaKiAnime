import qs from "qs";
import cheerio from 'react-native-cheerio';
import { SourceAbstract, TaiyakiSourceLanguage, TaiyakiSourceTypes } from ".";
import { TaiyakiScrapedTitleModel } from "../../Models";


class AnimeOwl extends SourceAbstract {
    baseUrl: string = 'https://animeowl.net';
    source: TaiyakiSourceTypes = 'AnimeOwl';
    language: TaiyakiSourceLanguage = 'English';
    options: { hasCloudflare: boolean; name: string; } = {hasCloudflare: false, name: 'Anime Owl'};
    controller: AbortController = new AbortController();
    
    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const request = await (await fetch(this.baseUrl + '/?' + qs.stringify({s: title}), {signal: this.controller.signal})).text();
        const $ = cheerio.load(request);
        return $('div.posts.row > div.post.col-6.col-sm-4.col-md-3.col-lg-2').toArray().map((e: any) => {
                        const link = $(e).find('a').attr('href');
                        const title = $(e).find('h4').text();
                        const image = $(e).find('img').attr('src');
                        return {
                            title,
                            image,
                            embedLink: link
                        }
                    })
    }
    async availableEpisodes(link: string): Promise<string[]> {
        const filteredLink = link.replace('/tv-show/', '/');
        const response = await (await fetch(filteredLink, {signal: this.controller.signal})).text();

        const $ = cheerio.load(response);
        return $('#episodes > div').toArray().map((e: any) => {
            const link = $(e).find('a').attr('href');
            return link;
        })    
    }
    
    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
        const filteredLink = episodeLink.replace('/tv-show/', '/');
        const response = await (await fetch(filteredLink, {signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        const directLink = $('div.list-server').find('button[class=\"server-number button\"]').attr('data-source');
        const newFetch = await fetch(this.baseUrl + directLink, {
            headers: {
                Host: 'animeowl.net'
            },
            signal: this.controller.signal,
        });
        if (newFetch.ok) {
            const json = await newFetch.json();
            const {
                cloud9xx
            } = json;
            const box: { link: string; server: string; }[] = [];
            const _ = Object.entries(cloud9xx).map((i) => {
                box.push({
                    link: i[1],
                    server: i[0] + '-animeowl'
                });
            });
            return box;
        } else {
            throw ("Could not find a valid json")
        }
    }

}

export default AnimeOwl;
