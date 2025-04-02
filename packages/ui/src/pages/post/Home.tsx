import UploadSection from "@/components/post/AddSection";
import Post from "@/components/post/Post";
import QueryConstants from "@/constants/queryConstants";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import { useWindowResize } from "@/hooks/useWindowResize";
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
import { ComponentType, useCallback, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  VariableSizeList as _VariableSizeList,
  VariableSizeListProps,
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

const List = _VariableSizeList as ComponentType<VariableSizeListProps>;

function Home() {
  usePrivateAxios();

  const listRef = useRef(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QueryConstants.HOME_POST_LIST],
    queryFn: ({ pageParam = 1 }) => postService.getPostsForUser(pageParam, 3),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.metadata?.hasNextPage
        ? lastPage?.data?.metadata?.page + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const postList = data?.pages?.flatMap((page) => page?.data?.data) || [];

  const totalPosts = data?.pages[0]?.data?.metadata?.totalItems || 0;

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < postList.length;
  // index < postList.length && postList[index] !== null;

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    fetchNextPage();
  };

  const sizeMap = useRef({});

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef?.current?.resetAfterIndex(index);
  }, []);

  const getSize = (index: number) => sizeMap.current[index] + 10|| 50;

  const [windowWidth] = useWindowResize();

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
        <Box sx={{ height: "100%" }}>
          <Box sx={{ height: "100%" }}>
            <AutoSizer>
              {({ height, width }) => (
                <InfiniteLoader
                  isItemLoaded={isItemLoaded}
                  itemCount={totalPosts}
                  loadMoreItems={loadMoreItems}
                  threshold={1} // No of items from end to trigger load more
                >
                  {({ onItemsRendered, ref }) => (
                    <List
                      height={height}
                      itemCount={postList.length}
                      itemSize={getSize}
                      width={width}
                      ref={listRef}
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
                              index={index}
                              setSize={setSize}
                              windowWidth={windowWidth}
                            />
                          </div>
                        );
                      }}
                    </List>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </Box>

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
