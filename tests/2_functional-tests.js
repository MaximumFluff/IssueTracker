/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

/*
  _id fields are randomly generated and not auto incrementing, so had to use pre-existing values in database to test. Will need to implement a auto-incrementing function for _id fields at some point
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
    suite('POST /api/issues/{project} => object with issue data', () => {
      
      test('Every field filled in', done => {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA')
          done();
        });
      });
      
      test('Required fields filled in', done => {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Styling',
            issue_text: 'Flexbox bug on homepage',
            created_by: 'Fontaine'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Styling');
            assert.equal(res.body.issue_text, 'Flexbox bug on homepage');
            assert.equal(res.body.created_by, 'Fontaine');
            assert.equal(res.body.assigned_to, undefined);
            assert.equal(res.body.status_text, undefined);
            done();
          })
      });
      
      test('Missing required fields', done => {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'Failed to save document');
            done();
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', done => {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: "5d2f94d729ae69675023593b"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'No updated fields sent');
            done();
          })
      });
      
      test('One field to update', done => {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: "5d2f9350f20f155c33e07875",
            assigned_to: "Ham",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "Succesfully updated");
            done();
          })
      });
      
      test('Multiple fields to update', done => {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: "5d2f9350f20f155c33e07875",
            assigned_to: "Ham",
            status_text: "HamHamHam",
            open: false
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "Succesfully updated");
            done();
          })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', done => {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', done => {
        chai.request(server)
          .get('/api/issues/test')
          .query({ assigned_to: "Chai and Mocha" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', done => {
        chai.request(server)
          .get('/api/issues/test')
          .query({ assigned_to: "Chai and Mocha", issue_title: "Title" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', () => {
      
      test('No _id', done => {
        chai.request(server)
          .delete('/api/issues/test')
          .send({ _id: "" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, '_id error')
            done();
          })
      });
      
      test('Valid _id', done => {
        chai.request(server)
          .delete('/api/issues/test')
          .send({ _id: "5d2f95f31a4a546e4ca131c2" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'Deleted _id: ' + '5d2f95f31a4a546e4ca131c2')
            done();
          })
      });
      
    });

});
