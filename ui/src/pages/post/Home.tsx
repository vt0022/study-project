import Post from "@/components/post/Post";
import PreviewImage from "@/components/post/PreviewImage";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import postService from "@/services/postService";
import { ImageOutlined, LockPersonOutlined, PublicOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, FormControl, Grid2, IconButton, ListItemIcon, ListItemText, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Fragment, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

function Home() {
    usePrivateAxios();

    const {
        control,
        resetField,
        handleSubmit,
        watch,
        reset,
    } = useForm();

    const imageRef = useRef(null);

    const [preview, setPreview] = useState("");

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["postList"],
        queryFn: ({ pageParam = 1 }) => postService.getPostsForUser(pageParam, 2),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.data.metadata.hasNextPage ? lastPage.data.metadata.page + 1 : undefined;
        },
    });

    const mutation = useMutation({
        mutationFn: (formData) => postService.createPost(formData),
        onSuccess: () => {
            reset();
            setPreview("");
        },
        onError: (error) => {
            console.error("Error creating post:", error);
        },
    });

    const { ref, inView } = useInView({
        threshold: 1,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        const urlImage = URL.createObjectURL(file);
        setPreview(urlImage);
    };

    const onRemovePreview = () => {
        setPreview("");
        resetField("image");
        imageRef.current.value = null; // Reset file input
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("file", data.image);
        formData.append("content", data.content);
        formData.append("privacy", JSON.stringify(data.isPrivate));
        mutation.mutate(formData);
    };

    return (
        <Stack
            spacing="10px"
            sx={{
                backgroundColor: "#f0f0f0",
                marginLeft: "400px",
                flexGrow: 1,
                paddingX: "10px",
            }}>
            <Box sx={{ backgroundColor: "white", padding: "20px", position: "sticky", top: "10px", zIndex: "1000" }}>
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack sx={{ marginBottom: 2 }}>
                                <FormControl size="small" sx={{ width: "fit-content" }}>
                                    <Controller
                                        name="privacy"
                                        control={control}
                                        defaultValue={false}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        {selected ? <LockPersonOutlined fontSize="small" /> : <PublicOutlined fontSize="small" />}
                                                        <Typography>{selected ? "Only me" : "Public"}</Typography>
                                                    </Box>
                                                )}>
                                                <MenuItem value={true}>
                                                    <ListItemIcon>
                                                        <LockPersonOutlined fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Only me" />
                                                </MenuItem>
                                                <MenuItem value={false}>
                                                    <ListItemIcon>
                                                        <PublicOutlined fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Public" />
                                                </MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Stack>

                            <Stack spacing={2}>
                                <Controller
                                    name="content"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="What is on your mind?"
                                            multiline
                                            maxRows={10}
                                            variant="standard"
                                            fullWidth
                                            slotProps={{
                                                input: { sx: { fontSize: "25px" } },
                                                inputLabel: { sx: { fontSize: "20px" } },
                                            }}
                                        />
                                    )}
                                />

                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <IconButton aria-label="Upload image" color="primary" component="label">
                                        <ImageOutlined />

                                        <Controller
                                            name="image"
                                            control={control}
                                            defaultValue={null}
                                            render={({ field: { value, onChange, ...field } }) => (
                                                <VisuallyHiddenInput
                                                    {...field}
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/bmp, image/webp, image/jpg"
                                                    // File input is uncontrolled so must set name to it
                                                    value={value?.fileName}
                                                    onChange={(e) => {
                                                        // Transfer file into controller
                                                        onChange(e.target.files[0]);
                                                        handleUploadImage(e);
                                                    }}
                                                    ref={imageRef}
                                                />
                                            )}
                                        />
                                    </IconButton>
                                    <Button variant="contained" sx={{ borderRadius: "1000px" }} type="submit" disabled={!watch("content") && !preview} loading={mutation.isPending}>
                                        Post
                                    </Button>
                                </Box>

                                <PreviewImage preview={preview} onRemove={onRemovePreview} />
                            </Stack>
                        </form>
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
                            {page.data.data.map((post) => (
                                <Post key={post.id} firstName={post.user.firstName} lastName={post.user.lastName} avatar="" content={post.content} date={post.createdAt} imageUrl={post.imageUrl} thumbnailUrl={post.thumbnailUrl} totalLikes={post.totalLikes} totalComments={post.totalComments} isLiked={true} />
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
                </Box>
            )}
        </Stack>
    );
}

export default Home;
