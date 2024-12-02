export const Winner = {
    name: undefined,
    department: undefined,
    year: undefined,
    toString: function () {
      return `${this.name} - ${this.department} - ${this.year}`;
    }
  };
  
  export const Result = {
    type: '',
    item: '',
    first: [],
    second: [],
    third: []
  };
  