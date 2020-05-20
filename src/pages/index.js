import React from 'react';
import { Helmet } from 'react-helmet';

import { usePageSpeedReports } from 'hooks';

import Layout from 'components/Layout';
import Container from 'components/Container';

const IndexPage = () => {
  const { reports } = usePageSpeedReports();

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
                    First Contentful Paint
                  </li>
                </ul>
              </div>
              { reports.map((report = {}) => {
                const { id, timestamp } = report;
                const firstContentfulPaint = report.auditByName('first_contentful_paint');

                return (
                  <div key={id} className="dashboard-table-row">
                    <ul>
                      <li>
                        { `${new Date(timestamp)}` }
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
