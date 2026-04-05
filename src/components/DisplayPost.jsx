import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import matter from 'gray-matter';
import { Container, Typography, Link } from "@mui/material";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
            <Container>
                <Typography variant="h4" align="center" sx={{ paddingBottom: ".5em" }}>Not Found</Typography>
                <Typography variant="body1" align="center">Sorry, couldn't find this post :&#40;</Typography>
            </Container>
        )
    }
    return (
        <Container>
            <Typography variant="h4" align="center" sx={{ paddingBottom: ".25em" }}>{title}</Typography>
            <Typography variant="h6" align="center" sx={{ color: "#666", fontSize: "1.1rem" }}>{date}</Typography>
            <Container maxWidth="md">
                <ReactMarkdown
                    components={{
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
        </Container>
    );
}

export default DisplayPost;
