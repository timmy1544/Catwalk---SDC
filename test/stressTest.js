import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '3m', target: 10 },
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 1000 },
    { duration: '3m', target: 1000 },
    { duration: '3m', target: 0 },
  ],
};

export default function () {
  const BASE_URL = 'http://localhost:3000'; // make sure this is not production

  const responses = http.batch([
    ['GET', `${BASE_URL}/api/reviews/1`, null, { tags: { name: 'Review_API' } }],
    ['GET', `${BASE_URL}/api/reviews/2`, null, { tags: { name: 'Review_API' } }],
    ['GET', `${BASE_URL}/api/reviews/meta/1`, null, { tags: { name: 'Review_API' } }],
    ['GET', `${BASE_URL}/api/reviews/meta/2`, null, { tags: { name: 'Review_API' } }],
  ]);

  sleep(1);
}
