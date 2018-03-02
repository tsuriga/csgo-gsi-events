import test from 'ava';

import CsgoEventEmitter from '../dist/csgo-event-emitter';

const authToken = 'test123';

const getCsgoEventEmitter = () => {
  return new CsgoEventEmitter({ authToken, serverless: true });
};

test('prevents processing data with wrong authToken', t => {
  const csgoEvents = getCsgoEventEmitter();
  const testData = { auth: { token: 'wrongtoken' } };

  csgoEvents.on('data', (data) => {
    t.fail('Data emitted with wrong auth token');
  });

  csgoEvents.processPayload(testData);
  t.pass();
});

test('emits raw data', t => {
  const csgoEvents = getCsgoEventEmitter();
  const testData = { auth: { token: authToken } };

  csgoEvents.on('data', (data) => {
    t.is(data.raw.auth.token, authToken);
  });

  csgoEvents.processPayload(testData);
});
