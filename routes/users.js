var express = require('express');
var db = require('../database');
var app = express();
var logged_user;
module.exports = app;

app.get('/', function (request, response) {

    // TODO: Initialize the query variable with a SQL query
    // that returns all the rows and columns in the 'users' table
    var query = 'SELECT * FROM users;';

    db.any(query)
      .then(function (rows) {
          // render views/users/list.ejs template file
          response.render('users/list', {
              title: 'Player Listing',
              data: rows
          })
      })
      .catch(function (err) {
          // display error message in case an error
          request.flash('error', err);
                    response.render('users/list', {
                        title: 'Player listing',
                        data: ''
                    })
                })
});
app.get('/add', function (request, response) {
  // render views/store/add.ejs
      response.render('users/add', {
          title: 'Sign Up',
          username: '',
          password: ''
      })
});

// Route to insert an item. Notice that request method is POST here
app.post('/add', function (request, response) {
    // Validate user input - ensure non emptiness
    /*don't think we need line below*/
    /*request.assert('id', 'id is required').notEmpty();*/
    request.assert('username', 'username is required').notEmpty();
    request.assert('password', 'password is required').notEmpty();
    var errors = request.validationErrors();
        if (!errors) { // No validation errors
            var item = {
                // sanitize() is a function used to prevent Hackers from inserting
                // malicious code(as data) into our database. There by preventing
                // SQL-injection attacks.
                username: request.sanitize('username').escape().trim(),
                password: request.sanitize('password').escape().trim()
            };
            var query = "SELECT id FROM users WHERE username='"+ item.username +"' OR password='"+ item.password +"';";

            db.any(query)
                .then(function (row) {
                    // if item not found
                    if (row.length >= 1) {
                        request.flash('error', 'A player already has this username or password');
                        response.render('users/add', {
                            title: 'Sign Up',
                            username: item.username,
                            password: item.password
                        })
                    }
                    else {
                      // Running SQL query to insert data into the store table
                      db.none('INSERT INTO users(username, password) VALUES($1, $2)', [item.username, item.password])
                          .then(function (result) {
                              request.flash('success', 'Player data added successfully!');
                              // render views/store/list.ejs
                              // after user makes new account send him
                              // to the profiles list
                              response.redirect('/users')
                          }).catch(function (err) {
                            request.flash('error', err);
                            // render views/store/add.ejs
                            response.render('users/add', {
                                title: 'Sign Up',
                                username: item.username,
                                password: item.password
                            })
                          })
                    }
                })
                .catch(function (err) {
                  db.none('INSERT INTO users(username, password) VALUES($1, $2)', [item.username, item.password])
                      .then(function (result) {
                          request.flash('success', 'Player data added successfully!');
                          // render views/store/list.ejs
                          // after user makes new account send him
                          // to the profiles list
                          response.redirect('/users')
                      }).catch(function (err) {
                        request.flash('error', err);
                        // render views/store/add.ejs
                        response.render('users/add', {
                            title: 'Sign Up',
                            username: item.username,
                            password: item.password
                        })
                      })
                })
        } else {
            var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
            request.flash('error', error_msg);
            response.render('users/add', {
                title: 'Sign Up',
                username: request.body.username,
                password: request.body.password
            })
          }
});

app.get('/login', function (request, response) {
  // render views/login.ejs
      response.render('users/login', {
          title: 'Log In',
          username: '',
          password: ''
      })
});

app.post('/login', function (request, response) {
  request.assert('username', 'username is required').notEmpty();
  request.assert('password', 'password is required').notEmpty();
  var errors = request.validationErrors();
      if (!errors) { // No validation errors
          var item = {
              // sanitize() is a function used to prevent Hackers from inserting
              // malicious code(as data) into our database. There by preventing
              // SQL-injection attacks.
              username: request.sanitize('username').escape().trim(),
              password: request.sanitize('password').escape().trim()
          };
          var query = "select id from users where username='"+ item.username +"' and password='"+ item.password +"';";

          db.one(query)
              .then(function (row) {
                  // if item not found
                  if (row.length == 0) {
                      request.flash('error', 'Player not found');
                      response.redirect('users/login')
                  }
                  else {
                      logged_user = query;
                      request.flash('success', 'Player found');
                      response.redirect('/users')
                  }
              })
              .catch(function (err) {
                  request.flash('error', 'Player not found');
                  response.render('users/login', {
                      title: 'Log In',
                      username: request.body.username,
                      password: request.body.password
                  })
              })
          // Running SQL query to insert data into the store table
      } else {
          var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
          request.flash('error', 'Player not found');
          response.render('users/login', {
              title: 'Log In',
              username: request.body.username,
              password: request.body.password
          })
        }
});

// route to edit an item
app.get('/edit/(:id)', function (request, response) {
   // Fetch the id of the item from the request.
   var itemId = request.params.id;

   // TODO: Initialize the query variable with a SQL query
   // that returns all columns of an item whose id = itemId in the
   // 'store' table
   var query = 'SELECT * FROM users WHERE id = '+ itemId +';';
   db.one(query)
       .then(function (row) {
           // if item not found
           if (row.length == 0) {
               request.flash('error', 'Player not found with id = ' + request.params.id);
               response.redirect('/users')
           }
           else {
               response.render('users/edit', {
                   title: 'Edit Player',
                   id: row.id,
                   username: row.username,
                   password: row.password
               })
           }
       })
       .catch(function (err) {
           request.flash('error', err);
           response.render('users/list', {
               title: 'Player listing',
               data: ''
           })
       })
});

// Route to update values. Notice that request method is PUT here
app.put('/edit/(:id)', function (req, res) {
   // Validate user input - ensure non emptiness
   req.assert('username', 'username is required').notEmpty();
   req.assert('password', 'password is required').notEmpty();

   var errors = req.validationErrors();
   if (!errors) { // No validation errors
       var item = {
           // sanitize() is a function used to prevent Hackers from inserting
           // malicious code(as data) into our database. There by preventing
           // SQL-injection attacks.
           username: req.sanitize('username').escape().trim(),
           password: req.sanitize('password').escape().trim()
       };

       // Fetch the id of the item from the request.
       var itemId = req.params.id;

       // TODO: Initialize the updateQuery variable with a SQL query
       // that updates the details of an item given its id
       // in the 'store' table
       var updateQuery = "UPDATE users SET username = '"+ item.username +"', password = '"+ item.password +"' WHERE id = "+ itemId +";";

       // Running SQL query to insert data into the store table
       db.none(updateQuery)
           .then(function (result) {
               req.flash('success', 'Data updated successfully!');
               res.redirect('/users');
           })
           .catch(function (err) {
               req.flash('error', err);
               res.render('users/edit', {
                   title: 'Edit Item',
                   username: req.params.username,
                   password: req.body.password
               })
           })
   }
   else {
       var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
       req.flash('error', error_msg);
       res.render('users/edit', {
           title: 'Edit Item,',
           username: req.body.username,
           password: req.body.password
       })
   }
});

// Route to delete an item. Notice that request method is DELETE here
app.delete('/delete/(:id)', function (req, res) {
    // Fetch item id of the item to be deleted from the request.
    var itemId = req.params.id;

    // TODO: Initialize the deleteQuery variable with a SQL query
    // that deletes an item whose id = itemId in the
    // 'store' table
    var deleteQuery = 'DELETE FROM users WHERE id = '+ itemId +';';
    db.none(deleteQuery)
        .then(function (result) {
                  req.flash('success', 'successfully deleted it');
                  res.redirect('/users');
        })
        .catch(function (err) {
                   req.flash('error', err);
                   res.redirect('/users')
        })
});
