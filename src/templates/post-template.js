import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Post from '../components/Post';
import { useSiteMetadata } from '../hooks';

const PostTemplate = ({ data }) => {
  console.log(data)
  const post = data.wordpressPost;
  const slug = data.wordpressPost.slug;
  const { title, metaDescription } = data.site.siteMetadata;

  return (
    <Layout title={`${post.title} - ${ title }`} description={ metaDescription}>
      {/* <Post post={data.markdownRemark} /> */}
      <h1>{ post.title }</h1>
      <div dangerouslySetInnerHTML={{  __html: post.content }} />
    </Layout>
  );
};


export const query = graphql`
  query PostBySlug($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
    }
    wordpressPost(id: { eq: $id }) {
      title
      content
      slug
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`;


export default PostTemplate;
