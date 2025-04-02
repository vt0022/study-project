import Post from "@/components/post/Post";
import UploadSection from "@/components/post/AddSection";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import postService from "@/services/postService";
import {
  Avatar,
  Box,
  CircularProgress,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect, ComponentType } from "react";
import { useInView } from "react-intersection-observer";
import {
  VariableSizeList as _VariableSizeList,
  VariableSizeListProps,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import QueryConstants from "@/constants/queryConstants";

const List = _VariableSizeList as ComponentType<VariableSizeListProps>;

function Home() {
  usePrivateAxios();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QueryConstants.HOME_POST_LIST],
    queryFn: ({ pageParam = 1 }) => postService.getPostsForUser(pageParam, 2),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.metadata?.hasNextPage
        ? lastPage?.data?.metadata?.page + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

  // const { ref, inView } = useInView({
  //   threshold: 1,
  //   triggerOnce: false,
  // });

  // useEffect(() => {
  //   if (inView) {
  //     fetchNextPage();
  //   }
  // }, [inView]);

  const postList = data?.pages?.flatMap((page) => page?.data?.data) || [];

  const totalPosts = data?.pages[0]?.data?.metadata?.totalItems || 0;

  const isItemLoaded = (index: number) => !!postList[index];

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    fetchNextPage();
  };

  return (
    <Stack
      spacing="10px"
      sx={{
        backgroundColor: "#f0f0f0",
        marginLeft: "400px",
        flexGrow: 1,
        paddingX: "10px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "20px",
          position: "sticky",
          top: "10px",
          zIndex: "1000",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Home
        </Typography>
      </Box>

      <Box sx={{ backgroundColor: "white", p: "20px" }}>
        <Grid2 container spacing={3}>
          <Grid2>
            <Avatar alt="My avatar" sx={{ width: "50px", height: "50px" }}>
              Me
            </Avatar>
          </Grid2>

          <Grid2 size="grow">
            <UploadSection from="home" />
          </Grid2>
        </Grid2>
      </Box>

      {isFetching && !isFetchingNextPage ? (
        <Box sx={{ margin: "auto" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: "100%", flex: "1" }}>
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={totalPosts}
                loadMoreItems={loadMoreItems}
                // threshold={15} // No of items from end to trigger load more
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    height={height}
                    itemCount={postList.length}
                    itemSize={() => 550}
                    width={width}
                    ref={ref}
                    onItemsRendered={onItemsRendered}
                  >
                    {({ index, style }) => {
                      const post = postList[index];

                      return (
                        <div style={style}>
                          <Post
                            key={post.id}
                            id={post.id}
                            firstName={post.user.firstName}
                            lastName={post.user.lastName}
                            avatar=""
                            content={post.content}
                            date={post.createdAt}
                            imageUrl={post.imageUrl}
                            thumbnailUrl={post.thumbnailUrl}
                            isPrivate={post.isPrivate}
                            isLiked={post.isLiked}
                            totalLikes={post.totalLikes}
                            totalComments={post.totalComments}
                          />
                        </div>
                      );
                    }}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>

          {isFetchingNextPage && (
            <Box sx={{ margin: "auto" }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Typography>Something went wrong</Typography>}

          {!hasNextPage && <Typography>All posts are here</Typography>}
        </Box>
      )}
    </Stack>
  );
}

export default Home;
