class PageSpeedAudit {
  constructor(report = {}) {
    const data = report?.data;
    const lighthouseResult = data?.lighthouseResult;

    this.id = report?.id;
    this.timestamp = data?.analysisUTCTimestamp;
    this.url = lighthouseResult?.requestedUrl;
    this.audits = lighthouseResult?.audits;
  }

  auditByName(name) {
    return this.audits[name];
  }
}

export default PageSpeedAudit;