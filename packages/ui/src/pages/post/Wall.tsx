import Post from "@/components/post/Post";
import UploadSection from "@/components/post/AddSection";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import { RootState } from "@/redux/store";
import postService from "@/services/postService";
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";

function Wall() {
  usePrivateAxios();

  const { _persist, ...user } = useSelector(
    (state: RootState) => state.user
  ) || {
    firstName: "",
    lastName: "",
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["myPostList"],
    queryFn: ({ pageParam = 1 }) => postService.getMyPosts(pageParam, 2),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.metadata?.hasNextPage
        ? lastPage?.data?.metadata?.page + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const isEmpty =
    !isFetching &&
    (!data || data.pages.every((page) => page.data.length === 0));

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

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
          Wall
        </Typography>
        {/* <Avatar alt="My avatar" sx={{ width: "100px", height: "100px" }}>
          Me
        </Avatar> */}
      </Box>

      <Box sx={{ backgroundColor: "white", p: "20px" }}>
        <Grid2 container spacing={3}>
          <Grid2>
            <Avatar alt="My avatar" sx={{ width: "50px", height: "50px" }}>
              Me
            </Avatar>
          </Grid2>

          <Grid2 size="grow">
            <UploadSection from="wall" />
          </Grid2>
        </Grid2>
      </Box>

      {isFetching && !isFetchingNextPage ? (
        <Box sx={{ margin: "auto" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {data?.pages.map((page, index) => (
            <Fragment key={index}>
              {page?.data?.data.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  firstName={user?.firstName || ""}
                  lastName={user?.lastName || ""}
                  avatar=""
                  content={post.content}
                  date={post.createdAt}
                  imageUrl={post.imageUrl}
                  thumbnailUrl={post.thumbnailUrl}
                  isPrivate={post.isPrivate}
                  isLiked={post.isLiked}
                  totalLikes={post.totalLikes}
                  totalComments={post.totalComments}
                  isMine={true}
                />
              ))}
            </Fragment>
          ))}

          <Box ref={ref} />

          {isFetchingNextPage && (
            <Box sx={{ margin: "auto" }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Typography>Something went wrong</Typography>}

          {!hasNextPage && <Typography>All posts are here</Typography>}

          {isEmpty && (
            <Typography>We haven't found anything for you</Typography>
          )}
        </Box>
      )}
    </Stack>
  );
}

export default Wall;
