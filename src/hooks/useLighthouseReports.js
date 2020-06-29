import { graphql, useStaticQuery } from 'gatsby';

import Audit from 'models/Audit';

export default function useLighthouseReports() {
  const { allReportsJson = {} } = useStaticQuery( graphql`
    query {
      allReportsJson {
        edges {
          node {
            fetchTime
            audits {
              first_contentful_paint {
                title
                numericUnit
                numericValue
              }
              first_cpu_idle {
                title
                numericUnit
                numericValue
              }
              total_byte_weight {
                title
                numericUnit
                numericValue
              }
            }
          }
        }
      }
    }
  `);

  let reports = allReportsJson?.edges?.map(({ node } = {}) => {
    return {
      timestamp: node?.fetchTime,
      audits: node?.audits
    }
  });

  reports = reports.map(report => {
    const { audits, timestamp } = report;
    return {
      timestamp,
      audits: Object.keys(audits).map(key => {
        return new Audit({
          timestamp,
          id: key,
          ...audits[key]
        })
      })
    }
  });

  reports = averageReportsByDay(reports);

  return {
    reports
  }
}

function averageReportsByDay(reports) {
  const reportsByDate = {};

  // Group reports by day

  reports.forEach(report => {
    const beginningOfDay = new Date(report?.timestamp);

    beginningOfDay.setHours(0,0,0,0);

    const timestamp = beginningOfDay.getTime();

    if (!Array.isArray(reportsByDate[timestamp])) {
      reportsByDate[timestamp] = [report];
    } else {
      reportsByDate[timestamp].push(report);
    }
  });

  return Object.keys(reportsByDate).map(timestamp => {
    const auditSets = reportsByDate[timestamp].map(({ audits } = {}) => audits);
    const audits = {};

    auditSets.forEach(set => {
      set.forEach(audit => {
        if ( !audits[audit.id] ) {
          audits[audit.id] = {
            id: audit.id,
            values: [audit.numericValue],
            numericUnit: audit.numericUnit,
            title: audit.title,
          }
        } else {
          audits[audit.id].values.push(audit.numericValue);
        }
      })
    });

    return {
      timestamp: parseInt(timestamp),
      audits: Object.keys(audits).map(key => {
        const { values, id, numericUnit, title } = audits[key];
        const average = values.reduce((a, b) => a + b) / values.length

        return new Audit({
          title,
          id,
          numericUnit,
          numericValue: average,
          timestamp: parseInt(timestamp)
        });
      })
    }
  });

}