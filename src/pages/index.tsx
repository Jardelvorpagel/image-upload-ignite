import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { ImagesQueryResponse } from './api/images';

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = null }): Promise<any> => {
    const response = await api.get('api/images', {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after ?? null,
  });

  const formattedData = useMemo(() => {
    const flattenedData = data?.pages.flat()[0].data;

    console.log(flattenedData);

    // return flattenedData?.map(({ data: dataQuery, ts, ref }) => ({
    //   title: dataQuery?.title,
    //   description: dataQuery?.description,
    //   url: dataQuery?.url,
    //   ts,
    //   id: ref?.id,
    // }));

    if (!flattenedData) return [];

    return flattenedData.map(({ title, description, url, ts, id }) => ({
      title,
      description,
      url,
      ts,
      id,
    }));
  }, [data]);

  console.log('formattedData', formattedData);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
