import qs from 'qs';
import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from '.';
import { TaiyakiScrapedTitleModel } from '../../Models';
import SourceAbstract from './SourceAbstract';

class AnimePahe extends SourceAbstract {
    language: TaiyakiSourceLanguage = 'English';
    source: TaiyakiSourceTypes = 'AnimePahe';
    baseUrl = 'https://animepahe.com';
    options = { hasCloudflare: false, name: 'AnimePahe'};
    

    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const params = qs.stringify({
            'm': "search",
            'l': 8,
            'q': title
    	})
        const settings = {
            headers: {
                'referer': 'https://animepahe.com/'
            }
        }
        const link = `https://animepahe.com/api?${params}`
        var searchResults = await (await fetch(link, settings)).json()
        if (searchResults['total'] != 0) {
            return searchResults['data'].map( result => {
                return {
                    title: `${result.title} (${result.type})`,
                    link: 'https://animepahe.com/anime/' + result.session + '/' + result.id,
                    embedLink : result.poster
                }
            })
        } else {
            return []
        }
    }

    async availableEpisodes(link: string): Promise<string[]> {
	const attr = link.split('/')
        const id = attr[attr.length - 1]
        var page = 1
        const apiUri = 'https://animepahe.com/api?m=release&id='+ id +'&sort=episode_asc&page='
        const jsonResponse = await (await fetch(apiUri + page, {method: 'GET', headers: {'referer': 'https://animepahe.com/'}})).json()
        const lastPage = jsonResponse['last_page']
        const perPage = jsonResponse['per_page']
        const total = jsonResponse['total']
        var ep = 1
        const episodes = []

        if (lastPage == 1 && perPage > total) {
            for (let epi of jsonResponse['data']) {
                episodes.push(`https://animepahe.com/api?m=links&id=${epi.anime_id}&session=${epi.session}&p=kwik!!TRUE!!`)
            }
        } else {
            for (let page=1; page<lastPage+1; page++) {
                for (let i=0; i < perPage && ep <= total; i++) {
                    episodes.push(`https://animepahe.com/api?m=release&id=${id}&sort=episode_asc&page=${page}&ep=${ep}!!FALSE!!`)
                    ep++
                }
            }
        }
        return episodes
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
	if (episodeLink.includes('!!TRUE!!')) {
            episodeLink = episodeLink.replace('!!TRUE!!', '')
        } else {
            const regex = /\&ep\=(.*?)\!\!FALSE\!\!/
            const episodeNum = parseInt(episodeLink.match(regex)[1])
            episodeLink = episodeLink.replace(regex, '')
            const jsonResponse = await (await fetch(episodeLink, {method: 'GET', headers: {'referer': 'https://animepahe.com/'}})).json()
            const ep = jsonResponse['data'].map(episode => {
                if (episode.episode == episodeNum) {
                    return episode
                }
            }).filter(i => i != undefined)[0]
            episodeLink = `https://animepahe.com/api?m=links&id=${ep.anime_id}&session=${ep.session}&p=kwik`
        }
        const settings = {
            headers: {
                Referer: 'https://animepahe.com/'
            }
        }
        const res = await (await fetch(episodeLink, settings)).json()
        const qualities = []
        for (let video of res.data) {
            for (const [key, value] of Object.entries(video)) {
                qualities.push({
                    link: value.kwik,
                    label: `${key}p`,
                    server: 'kwik'
                })
            }
        }
        return qualities
    }
}

export default AnimePahe;
