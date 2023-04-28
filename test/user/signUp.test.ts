import { expect } from 'chai';
import app from '../../src/index';
import request from 'supertest';

describe('POST /api/register', () => {
  it('returns success with valid input', (done) => {
    const user = {
      name: 'Dolores Abernathy',
      email: 'dolores@westworld.com',
      password: 'vGuFQ1nJSSrdMaYV1LiN3G1i',
    };

    request(app)
      .post('/v1/auth/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.equal(true);
        expect(res.body.content.data.id).to.be.a('string');
        expect(res.body.content.data.name).to.equal(user.name);
        expect(res.body.content.data.email).to.equal(user.email);
        expect(res.body.content.data.created_at).to.be.a('string');
        expect(res.body.content.meta.access_token).to.be.a('string');
        done();
      });
  });

  it('returns invalid input error with invalid name', (done) => {
    const user = {
      name: 'D',
      email: 'dolores@westworld.com',
      password: 'vGuFQ1nJSSrdMaYV1LiN3G1i',
    };

    request(app)
      .post('/v1/auth/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.equal(false);
        expect(res.body.errors).to.have.lengthOf(1);
        expect(res.body.errors[0].param).to.equal('name');
        expect(res.body.errors[0].message).to.equal('Name should be at least 2 characters.');
        expect(res.body.errors[0].code).to.equal('INVALID_INPUT');
        done();
      });
  });

  it('returns invalid input error with invalid password', (done) => {
    const user = {
      name: 'Dolores Abernathy',
      email: 'dolores@westworld.com',
      password: 'p',
    };

    request(app)
      .post('/v1/auth/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.status).to.equal(false);
        expect(res.body.errors).to.have.lengthOf(1);
        expect(res.body.errors[0].param).to.equal('password');
        expect(res.body.errors[0].message).to.equal('Password should be at least 2 characters.');
        expect(res.body.errors[0].code).to.equal('INVALID_INPUT');
        done();
      });
  });

  it('should return an error for existing account', async (done) => {

    let user = {
      name: 'Dolores Abernathy',
      email: 'dolores@westworld.com',
      password: 'vGuFQ1nJSSrdMaYV1LiN3G1i'
    }

    
    const res = await request(app)
      .post('/v1/auth/signup').send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(false);
        expect(res.body.errors).to.have.lengthOf(1);
        expect(res.body.errors[0].param).to.equal('email');
        expect(res.body.errors[0].message).to.equal('User with this email address already exists.');
        expect(res.body.errors[0].code).to.equal('RESOURCE_EXISTS');
        done();
      });

  });

});
