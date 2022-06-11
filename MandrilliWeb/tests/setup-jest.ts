import 'jest-preset-angular/setup-jest';
import axios from 'axios';

jest.setTimeout(7500);

// https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios
axios.defaults.adapter = require('axios/lib/adapters/http');
