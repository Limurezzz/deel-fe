import data from "../mocks/mock_data.json";

const { 
  REACT_APP_API_TIMEOUT = 300, 
  REACT_APP_API_ERROR_MESSAGE = 'Something went wrong on API side',
  REACT_APP_FAIL_PROBABILITY = 0.05 // We can set up failing probability for our fake API. Here it is 5%
} = process.env;

const searchData: string[] = data.map(i => i.text);

// this is fake API call with some fail probability. For PROD we need to use real API.
const getMockDataQuery = (searchTerm?: string) => {
    let filteredData = searchData;
    if (searchTerm) {
      filteredData = searchData
        .filter(i => i.toLowerCase().includes(searchTerm));
    }
    return new Promise<string[]>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > REACT_APP_FAIL_PROBABILITY) {
          resolve(filteredData);
        } else {
          reject(new Error(REACT_APP_API_ERROR_MESSAGE));
        }
      }, Number(REACT_APP_API_TIMEOUT));
    });
}

export default getMockDataQuery;