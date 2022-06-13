import 'jest-preset-angular/setup-jest';
import 'core-js';
import axios from 'axios';

jest.setTimeout(30000);

// https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios
axios.defaults.adapter = require('axios/lib/adapters/http');
