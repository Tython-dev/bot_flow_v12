import http from 'k6/http';
import { sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export let options = {
 stages: [
  { duration: '1m', target: 50 },
  { duration: '2m', target: 100 },
  { duration: '2m', target: 200 },
  { duration: '3m', target: 500 },  // Hold at realistic load
  { duration: '1m', target: 0 },
]
};

export default function () {

  // Generate a unique conversation ID for this VU session
  const conversationId = uuidv4();

  // ✅ Use conversationId directly in the URL instead of "brahim"
  const url = `https://bot12.tybotflow.com/api/v1/bots/bot_bp_test/converse/${conversationId}`;

  const messages = [
    "Salam",
    "Type 1",
    "Plus d’informations"
  ];

  for (let msg of messages) {
    // ✅ Clean payload structure without nested payload field
    const payload = JSON.stringify({
      type: "text",
      text: msg,
      includedContexts: ["global"],
      metadata: {}
    });

    const params = {
      headers: {
        'Content-Type': 'application/json'
      },
    };

    const res = http.post(url, payload, params);

    // Log status and capture error details for failed requests
    if (res.status !== 200) {
      console.log(`❌ Status: ${res.status} | conv: ${conversationId} | msg: "${msg}"`);
      console.log(`   Error: ${res.body.substring(0, 200)}`);
    } else {
      console.log(`✅ Status: ${res.status} | conv: ${conversationId} | msg: "${msg}"`);
    }

    // Simulate natural typing delay
    sleep(3 + Math.random() * 2);
  }

  // Pause before this VU starts another conversation
  sleep(5);
}
