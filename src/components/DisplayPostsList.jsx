import { Typography, ListItem, ListItemText, Link, Grid } from "@mui/material";
import { Link as LinkRouter } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PostsLinkListItem = ({ type, post }) => {
    if (post.draft) {
        return true;
    }
    return (
        <ListItem disableGutters>
            <ListItemText
                primary={
                    <>
                        <span style={{ color: "#666", paddingRight: 20 }}>{post.date}</span>
                        <Link component={LinkRouter} to={`${post.id}`} color="secondary" underline="always" display="inline">
                            {post.title}
                        </Link>
                        <span>
                            <span style={{ padding: '0 10px' }}>-</span>
                            &#91;{post.category}&#93;
                        </span>
                    </>
                }
            />
        </ListItem>
    )
}

function DisplayPostsLists({ title, type, posts }) {
    return (
        <>
            <Helmet title={`Daniel Reguero Blog | ${title}`} />
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={3}>
                    <Typography variant="h4" gutterBottom>{title}</Typography>
                </Grid>
                <Grid item xs={5}>
                    {posts.map((post, i) => <PostsLinkListItem post={post} type={type} key={i} />)}
                </Grid>
            </Grid>
        </>
    )
}

export default DisplayPostsLists;
