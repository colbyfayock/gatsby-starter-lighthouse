class Audit {
  constructor(data) {
    this.id = data.id;
    this.numericUnit = data.numericUnit;
    this.numericValue = data.numericValue;
    this.timestamp = data.timestamp;
    this.title = data.title;
  }
}

export default Audit;