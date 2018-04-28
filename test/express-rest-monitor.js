import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import expressRestMonitor from '../lib/express-rest-monitor';

/* global describe:false, it:false */
describe('express-rest-monitor test', () => {
  it('should return json response for normal requests', (done) => {
    const app = express();
    app.use(expressRestMonitor());
    app.get('/', (req, res) => {
      res.json({ success: true });
    });

    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  it('should return html response for html-preferring requests', (done) => {
    const app = express();
    app.use(expressRestMonitor());
    app.set('views', `${__dirname}/../lib/templates`);
    app.get('/', (req, res) => {
      res.json({ success: true });
    });

    request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .end((err, res) => {
        if (err) return done(err);
        expect(/<title>Express REST Admin<\/title>/.test(res.text)).to.equal(true);
        done();
      });
  });
});
