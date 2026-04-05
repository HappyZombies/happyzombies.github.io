import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import matter from 'gray-matter';
import { Container, Typography, Link } from "@mui/material";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Helmet } from "react-helmet-async";

const readingTime = (text) => {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return `~${time} min read`;
}

function DisplayPost({ type }) {
    const params = useParams();
    const [markdownContent, setMarkdownContent] = useState(null);
    const [markdownError, setMarkdownError] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    useEffect(() => {
        if (type === "blogs" || type === "projects") {
            const fetchMarkdownFile = async () => {
                const mdFile = await import(`../posts/${type}/${params.id}.md`);
                const markdown = await fetch(mdFile.default).then(res => res.text());
                return matter(markdown);
            };
            fetchMarkdownFile().then(matterObj => {
                setMarkdownContent(matterObj.content);
                setTitle(matterObj.data.title);
                setDate(matterObj.data.date);
            }).catch(err => {
                setMarkdownError(true);
                console.log({ err });
            })
            return;
        }
    }, [type, params.id])

    if (markdownError) {
        return (
            <>
                <Helmet title={`Daniel Reguero Blog | Post Not Found`} />
                <Typography variant="h4" align="center" sx={{ paddingBottom: ".5em" }}>Not Found</Typography>
                <Typography variant="body1" align="center">Sorry, couldn't find this post :&#40;</Typography>
            </>
        )
    }
    return (title && date && markdownContent && 
        <>
            <Helmet title={`Daniel Reguero Blog | ${title}`} />
            <Typography variant="h4" align="center" sx={{ paddingBottom: ".25em" }}>{title}</Typography>
            <Typography variant="h6" align="center" sx={{ color: "#666", fontSize: "1.1rem" }}>{date}</Typography>
            <Typography variant="h6" align="center" sx={{ color: "#666", fontSize: ".8rem" }}>{readingTime(markdownContent)}</Typography>
            <Container maxWidth="md">
                <ReactMarkdown
                    components={{
                        blockquote: ({ node, ...props }) => <blockquote {...props} style={{borderLeft: "1px dotted #fff", fontSize: "80%", margin: "2em 0", padding: "0 1.5em" }}/>,
                        a: ({ node, ...props }) => <Link color="secondary" {...props} />,
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = (Array.isArray(children) ? children.join('') : String(children ?? '')).replace(/\n$/, '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    children={codeString}
                                    style={a11yDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                />
                            ) : (
                                <SyntaxHighlighter
                                    children={codeString}
                                    style={a11yDark}
                                    PreTag="span"
                                    customStyle={{ padding: "2px 5px", backgroundColor: "#2c3437" }}
                                    {...props}
                                />
                            )
                        },
                        img: ({ node, ...props }) => <img alt={props.alt} style={{ maxWidth: "100%" }} {...props} />,
                    }}
                    children={markdownContent}
                />
            </Container>
        </>
    );
}

export default DisplayPost;
