import {useCallback, useEffect, useRef, useState} from 'react';
import {LayoutAnimation} from 'react-native';
import {SourceBase} from '../Classes/SourceBase';
import {SimklEpisodes} from '../Models/SIMKL';
import {DetailedDatabaseModel} from '../Models/taiyaki';
import {useSimklRequests} from './useRequest';

export function useDetailedHook(
  id: number,
  database?: DetailedDatabaseModel,
  idMal?: string,
) {
  const timer = useRef<NodeJS.Timeout>();
  const [rawLinks, setLinks] = useState<string[]>([]);
  const [fullData, setFullData] = useState<SimklEpisodes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setError] = useState<string>();

  const {
    query: {data: SimklEpisodeData},
    controller,
    ids,
  } = useSimklRequests<SimklEpisodes[]>(
    'simkl' + id,
    '/anime/episodes/',
    database?.ids?.simkl,
    idMal,
    true,
    id !== undefined && rawLinks.length > 0,
  );

  const _mixer = () => {
    let items: SimklEpisodes[] = [];
    for (let i = 0; i < rawLinks.length; i++) {
      const episode = SimklEpisodeData![i];
      const raw = rawLinks[i];
      if (episode) {
        episode.link = raw;
        episode.sourceName = database!.source.name;
        items.push(episode);
      } else {
        const episode: SimklEpisodes = {
          episode: i + 1,
          link: raw,
          title: 'Episode ' + (i + 1),
          ids: {simkl_id: 0},
          aired: true,
          img: undefined,
          sourceName: database!.source.name,
        };
        items.push(episode);
      }
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLoading(false);
    setError(undefined);
    setFullData(items);
  };

  useEffect(() => {
    if (
      SimklEpisodeData &&
      SimklEpisodeData.length > 0 &&
      rawLinks.length > 0
    ) {
      if (timer.current) clearTimeout(timer.current);
      _mixer();
    }
  }, [SimklEpisodeData, rawLinks]);

  useEffect(() => {
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (database && database.source && fullData.length === 0) {
      effect();
    }
  }, [database, fullData]);

  const effect = () => {
    findTitles();
    // timer.current = setTimeout(() => {
    //   if (rawLinks.length === 0 && fullData.length === 0) {
    //     console.log(rawLinks.length, fullData.length);
    //     setError('Waited 12 seconds but did not obtain any results');
    //   }
    // }, 12000);
  };

  if (!database || !database.link) return null;

  const source = new SourceBase(database.source);

  const retry = () => {
    setError(undefined);
    if (database && database.source) effect();
  };

  const findTitles = async () => {
    setIsLoading(true);
    source.scrapeAvailableEpisodes(database.link!).then((results) => {
      setIsLoading(false);
      setLinks(results);
    });
  };
  return {
    isLoading,
    data: fullData,
    error: hasError,
    retry,
    ids,
  };
}
