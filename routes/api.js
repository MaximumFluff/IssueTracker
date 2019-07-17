/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  status_text: String,
  created_on: String,
  updated_on: String,
  open: Boolean,
})

mongoose.connect(process.env.DB, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

module.exports = function (app) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res) {
      // Return array of all issues in project, will filter by parameters if object is not empty
      const IssueModel = mongoose.model(req.params.project, IssueSchema, req.params.project);
      IssueModel.find(req.query, (err, docs) => {
        if (err) console.error(err);
        else res.json(docs);
      })
    })
    
    .post(function (req, res) {
      const currentDate = new Date();
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      // Define new model, forcing it not to define plural collection name
      const IssueModel = mongoose.model(req.params.project, IssueSchema, req.params.project);
      // Create new document based off the model
      const newIssue = new IssueModel({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: currentDate.toString(),
        updated_on: currentDate.toString(),
        open: true,
      })
      // Save document to collection
      newIssue.save((err, data) => {
        if (err) res.json('Failed to save document');
        else if (data.length === 0) res.json('Nothing found. Perhaps double-check your search parameters');
        else res.json(data);
      })
    })
    
    .put(function (req, res) {
      const currentDate = new Date();
      // Generate new object of valid (non-empty) values
      let newValues = {};
      for (const entry of Object.entries(req.body)) {
        if (entry[1] !== "" && entry[0] !== "_id") {
          newValues[entry[0]] = entry[1];
        }
      }
      // If _id not sent
      if (!req.body._id) {
        res.json('_id field is mandatory');
      }
      // If no updated fields sent
      else if (Object.entries(newValues).length === 0) {
        res.json('No updated fields sent');
      }
      else {
        // Generate model and update document
        const IssueModel = mongoose.model(req.params.project, IssueSchema, req.params.project);
        IssueModel.updateOne(
          { _id: req.body._id },
          { ...newValues, updated_on: currentDate.toString() },
          (err, data) => {
            if (err) res.json(`Could not update _id: ${req.body_id}`);
              else res.json('Succesfully updated');
          })
        }
    })
    
    .delete(function (req, res) {
      // If no _id is given
      if (!req.body._id) {
        res.json('_id error');
      }
      else {
        // Generate model and delete document
        const IssueModel = mongoose.model(req.params.project, IssueSchema, req.params.project);
        console.log(req.body._id)
        IssueModel.findByIdAndRemove(req.body._id, (err, data) => {
          console.log(err);
          if (err) res.json(`Could not delete _id: ${req.body._id}`)
          else res.json(`Deleted _id: ${req.body._id}`)
        })
      }
      
    });
    
};
