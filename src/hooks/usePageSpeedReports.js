import { graphql, useStaticQuery } from 'gatsby';

import PageSpeedAudit from 'models/PageSpeedAudit';

export default function useLighthouseReports() {
  const { allReportsJson = {} } = useStaticQuery( graphql`
    query {
      allReportsJson {
        edges {
          node {
            id
            lighthouseResult {
              audits {
                first_contentful_paint {
                  title
                  displayValue
                }
              }
              requestedUrl
            }
            analysisUTCTimestamp
          }
        }
      }
    }
  `);

  const reports = allReportsJson?.edges?.map(({ node } = {}) => {
    return node;
  });

  return {
    reports: reports.map(report => new PageSpeedAudit(report))
  }
}