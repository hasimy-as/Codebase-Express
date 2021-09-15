const test = require('supertest');

const app = require('../../src/server');
const { CODE } = require('../../src/helpers/lib/httpCode');

describe('server.js', () => {
  describe('#app', () => {
    it('Should success accessing /', (done) => {
      test(app).get('/').expect(CODE.SUCCESS).end(done);
    });

    it('Should fail if accessing undefined', (done) => {
      test(app).get('/foo').expect(CODE.NOT_FOUND).end(done);
    });
  });
});

