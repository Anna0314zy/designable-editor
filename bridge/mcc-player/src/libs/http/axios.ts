import axios from 'axios';
import { HTTP_REQUEST_TIMEOUT } from '../../constants';

export const Axios = axios.create({
  timeout: HTTP_REQUEST_TIMEOUT,
});
