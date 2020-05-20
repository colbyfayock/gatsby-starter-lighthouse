import React from 'react';
import { Helmet } from 'react-helmet';

import { useLighthouseReports } from 'hooks';

import Layout from 'components/Layout';
import Container from 'components/Container';

const IndexPage = () => {
  const { reports } = useLighthouseReports();

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container>
        <h1>Dashboard</h1>

        <div className="dashboard">
          { Array.isArray(reports) && reports.length > 0 && (
            <div className="dashboard-table">
              <div className="dashboard-table-header dashboard-table-row">
                <ul>
                  <li>
                    Fetch Time
                  </li>
                  <li>
                    Uses HTTPS
                  </li>
                  <li>
                    Redirects HTTP traffic to HTTPS
                  </li>
                  <li>
                    Redirects HTTP traffic to HTTPS
                  </li>
                </ul>
              </div>
              { reports.map((report = {}) => {
                const { id, fetchTime, audits = {} } = report;
                const usesHttps = audits.is_on_https;
                const redirectsToHttps = audits.redirects_http;
                const firstContentfulPaint = audits.first_contentful_paint;
                return (
                  <div key={id} className="dashboard-table-row">
                    <ul>
                      <li>
                        { fetchTime }
                      </li>
                      <li>
                        { usesHttps?.score === 1 ? 'Yes' : 'No' }
                      </li>
                      <li>
                        { redirectsToHttps?.score === 1 ? 'Yes' : 'No' }
                      </li>
                      <li>
                        { firstContentfulPaint?.displayValue }
                      </li>
                    </ul>
                  </div>
                )
              }) }
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default IndexPage;
