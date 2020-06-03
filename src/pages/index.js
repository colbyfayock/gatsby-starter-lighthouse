import React from 'react';
import { Helmet } from 'react-helmet';
import {Line} from 'react-chartjs-2';

import { usePageSpeedReports } from 'hooks';
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
  {
    id: 'first_meaningful_paint',
    label: 'First Meaninful Paint'
  },
  {
    id: 'total_byte_weight',
    label: 'Total Byte Weight'
  }
]

const IndexPage = () => {
  const { reports } = usePageSpeedReports();

  const rows = audits.map(audit => {
    const datasets = reports.map(report => {
      const { id, timestamp } = report;
      const data = report.auditByName(audit?.id);
      return {
        id,
        timestamp: friendlyDate(timestamp),
        value: data?.numericValue / 1000
      }
    });
    return {
      ...audit,
      datasets
    }
  });

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container>
        <h1>https://colbyfayock.com</h1>

        {rows.map((row = {}) => {
          const { label, id, datasets } = row;
          const data = {
            labels: datasets.map(({timestamp} = {}) => timestamp),
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
                  {audits.map(({ id, label } = {}) => {
                    return (
                      <li key={id}>
                        { label }
                      </li>
                    )
                  })}
                </ul>
              </div>
              { reports.map((report = {}) => {
                const { id, timestamp } = report;
                return (
                  <div key={id} className="dashboard-table-row">
                    <ul>
                      <li>
                        { friendlyDate(timestamp) }
                      </li>
                      {audits.map(({ id: auditId } = {}) => {
                        return (
                          <li key={auditId}>
                            { report.auditByName(auditId)?.displayValue }
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
