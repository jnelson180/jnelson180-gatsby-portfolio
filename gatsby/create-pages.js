'use strict';

const path = require('path');
const slash = require('slash');
const _ = require('lodash');

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // 404
  createPage({
    path: '/404',
    component: path.resolve('./src/templates/not-found-template.js')
  });

  // Tags list
  createPage({
    path: '/tags',
    component: path.resolve('./src/templates/tags-list-template.js')
  });

  // Categories list
  createPage({
    path: '/categories',
    component: path.resolve('./src/templates/categories-list-template.js')
  });

  // Posts and pages from markdown
  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        edges {
          node {
            frontmatter {
              template
            }
          }
        }
      }
      allWordpressPost {
        edges {
          node {
            id
            slug
            status
            template
            format
          }
        }
      }
      allWordpressPage {
        edges {
          node {
            id
            status
            template
            title
          }
        }
      }
    }
  `);

  const { edges } = result.data.allMarkdownRemark;

  _.each(edges, (edge) => {
    if (_.get(edge, 'node.frontmatter.template') === 'page') {
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve('./src/templates/page-template.js'),
        context: { slug: edge.node.fields.slug }
      });
    } else if (_.get(edge, 'node.frontmatter.template') === 'post') {
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve('./src/templates/post-template.js'),
        context: { slug: edge.node.fields.slug }
      });
    }
  });

  // handle wordpress results
  // Check for any errors
  if (result.errors) {
    throw new Error(result.errors)
  }

  // Access query results via object destructuring
  const { allWordpressPage, allWordpressPost } = result.data
  console.log("!!!!!", allWordpressPost)

  const pageTemplate = path.resolve(`./src/templates/page-template.js`)
  // We want to create a detailed page for each
  // page node. We'll just use the WordPress Slug for the slug.
  // The Page ID is prefixed with 'PAGE_'
  allWordpressPage.edges.forEach(edge => {
    // Gatsby uses Redux to manage its internal state.
    // Plugins and sites can use functions like "createPage"
    // to interact with Gatsby.
    createPage({
      // Each page is required to have a `path` as well
      // as a template component. The `context` is
      // optional but is often necessary so the template
      // can query data specific to each page.
      path: `/${edge.node.slug}/`,
      component: slash(pageTemplate),
      context: {
        id: edge.node.id,
      },
    })
  })

  console.log("!!!!!", allWordpressPost)
  const postTemplate = path.resolve(`./src/templates/post-template.js`)
  // We want to create a detailed page for each
  // post node. We'll just use the WordPress Slug for the slug.
  // The Post ID is prefixed with 'POST_'
  allWordpressPost.edges.forEach(edge => {
    createPage({
      path: `/${edge.node.slug}/`,
      component: slash(postTemplate),
      context: {
        id: edge.node.id,
      },
    })
  });

  // Feeds
  await createTagsPages(graphql, actions);
  await createCategoriesPages(graphql, actions);
  await createPostsPages(graphql, actions);
};


module.exports = createPages;
