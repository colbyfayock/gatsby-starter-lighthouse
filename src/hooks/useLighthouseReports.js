import { graphql, useStaticQuery } from 'gatsby';

export default function useLighthouseReports() {
  const { allReportsJson = {} } = useStaticQuery( graphql`
    query {
      allReportsJson {
        edges {
          node {
            id
            fetchTime
            audits {
              is_on_https {
                score
              }
              redirects_http {
                score
              }
              first_contentful_paint {
                displayValue
              }
            }
          }
        }
      }
    }
  `);

  const reports = allReportsJson?.edges?.map(({ node } = {}) => {
    return node;
  });

  return {
    reports
  }
}