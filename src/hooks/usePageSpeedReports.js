import { graphql, useStaticQuery } from 'gatsby';

import PageSpeedAudit from 'models/PageSpeedAudit';

export default function useLighthouseReports() {
  const { allReportsJson = {} } = useStaticQuery( graphql`
    query {
      allReportsJson {
        edges {
          node {
            id
            data {
              lighthouseResult {
                audits {
                  first_contentful_paint {
                    displayValue
                    numericValue
                  }
                  first_cpu_idle {
                    displayValue
                    numericValue
                  }
                  first_meaningful_paint {
                    displayValue
                    numericValue
                  }
                  total_byte_weight {
                    displayValue
                    numericValue
                  }
                }
                requestedUrl
              }
              analysisUTCTimestamp
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
    reports: reports.map(report => new PageSpeedAudit(report))
  }
}