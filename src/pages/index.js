import React from 'react';
import { Helmet } from 'react-helmet';
import {Line} from 'react-chartjs-2';

import { useLighthouseReports } from 'hooks';
import { friendlyDate } from 'lib/datetime';

import Layout from 'components/Layout';
import Container from 'components/Container';

const audits = [
  {
    id: 'first_contentful_paint',
    label: 'First Contentful Paint'
  },
  {
    id: 'first_cpu_idle',
    label: 'First CPU Idle'
  },
  // {
  //   id: 'first_meaningful_paint',
  //   label: 'First Meaninful Paint'
  // },
  {
    id: 'total_byte_weight',
    label: 'Total Byte Weight'
  }
]

const IndexPage = () => {
  const { reports } = useLighthouseReports();

  const rows = audits.map(row => {
    const { id } = row;

    const data = reports.map(report => {
      return report.audits.find(audit => audit.id === id);
    });

    return {
      ...row,
      datasets: data.map(({id, timestamp, numericValue}) => {
        return {
          id,
          timestamp,
          value: numericValue / 1000
        }
      })
    }
  });

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container>
        <h1>https://gatsby-starter-pagespeed-insights-report.netlify.app</h1>

        {rows.map((row = {}) => {
          const { label, id, datasets } = row;
          const data = {
            labels: datasets.map(({timestamp} = {}) => friendlyDate(timestamp)),
            datasets: [
              {
                label: label,
                data: datasets.map(({value} = {}) => value)
              },
            ]
          };
          return (
            <div key={id} className="dashboard-row">
              <h2 id={id}>{ label }</h2>
              <Line data={data} />
            </div>
          )
        })}

        <div className="dashboard">
          { Array.isArray(reports) && reports.length > 0 && (
            <div className="dashboard-table">
              <div className="dashboard-table-header dashboard-table-row">
                <ul>
                  <li>
                    Date
                  </li>
                  {reports[0].audits.map(({ id,  } = {}) => {
                    const audit = audits.find(audit => audit.id === id);
                    return (
                      <li key={id}>
                        { audit?.label }
                      </li>
                    )
                  })}
                </ul>
              </div>
              { reports.map((report = {}) => {
                const { audits, timestamp } = report;
                return (
                  <div key={timestamp} className="dashboard-table-row">
                    <ul>
                      <li>
                        { friendlyDate(timestamp) }
                      </li>
                      {audits.map(audit => {
                        return (
                          <li key={audit.id}>
                            { audit.numericValue }
                          </li>
                        )
                      })}
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
