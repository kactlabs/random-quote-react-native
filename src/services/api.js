const BASE_URL = 'https://fastapi-for-quote-dummy.vercel.app';

const FAKE_DELAY = 800; // ms

/**
 * Dummy login API
 * Accepts any email/password combo and returns a fake token
 */
export async function loginAPI(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject({ success: false, message: 'Email and password are required' });
        return;
      }
      resolve({
        success: true,
        token: 'fake-jwt-token-' + Date.now(),
        user: {
          id: 1,
          email: email,
          name: 'GenAI Learner',
        },
      });
    }, FAKE_DELAY);
  });
}

/**
 * Fetch a random quote from the Vercel API
 */
export async function fetchRandomQuoteAPI() {
  const response = await fetch(`${BASE_URL}/quotes/random`);
  const data = await response.json();
  return {
    success: true,
    data: data.quote,
  };
}

/**
 * Fetch all quotes from the Vercel API
 */
export async function fetchAllQuotesAPI() {
  const response = await fetch(`${BASE_URL}/quotes`);
  const data = await response.json();
  return {
    success: true,
    data: data.quotes,
  };
}

/**
 * "Send" a quote — calls the API to get the quote, then returns it for notification
 */
export async function sendQuoteAPI(quoteId) {
  const response = await fetch(`${BASE_URL}/quotes`);
  const data = await response.json();
  const quote = data.quotes.find((q) => q.id === quoteId);
  return {
    success: true,
    message: 'Quote sent successfully',
    data: quote,
  };
}
