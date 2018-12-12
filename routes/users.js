var express = require('express');
var db = require('../database');
var app = express();
module.exports = app;
var logged_user;
var hscore_user;
var score_user;
global.score_user;
global.hscore_user;
global.logged_user;
app.use(express.static(__dirname));

app.get('/', function (request, response) {

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
    var testId = request.body.id;
    var testUs = request.body.username;
    var testPa = request.body.password;
    console.log(testUs.length);
    console.log(testPa.length);
    console.log(testUs);
    console.log(testPa);
    if(testUs.length==0 || testPa.length==0){
      request.flash('error', 'neither field may be empty');
      response.render('users/add', {
          title: 'Sign Up',
          id: testId,
          username: testUs,
          password: testPa
      })
    }
    else{
    var errors = request.validationErrors();
        if (!errors) { // No validation errors
            var item = {
                username: request.sanitize('username').escape().trim(),
                password: request.sanitize('password').escape().trim()
            };
            global.logged_user = item.username;
	    global.hscore_user = 0;
            // ensures that person signing up doesn't use someone elses username
            var query = "SELECT id FROM users WHERE username='"+ item.username +"';";

            db.any(query)
                .then(function (row) {
                    // if item not found
                    if (row.length >= 1) {
                        request.flash('error', 'A player already has this username');
                        response.render('users/add', {
                            title: 'Sign Up',
                            username: item.username,
                            password: item.password
                        })
                    }
                    else {
                      // Running SQL query to insert data into the store table
                      db.none('INSERT INTO users(username, password, hscore) VALUES($1, $2, $3)', [item.username, item.password, 0])
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
                  db.none('INSERT INTO users(username, password) VALUES($1, $2 $3)', [item.username, item.password, 0])
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
  var testId = request.body.id;
  var testUs = request.body.username;
  var testPa = request.body.password;
  console.log(testUs.length);
  console.log(testPa.length);
  console.log(testUs);
  console.log(testPa);
  if(testUs.length==0 || testPa.length==0){
    request.flash('error', 'neither field may be empty');
    response.render('users/login', {
        title: 'Log In',
        id: testId,
        username: testUs,
        password: testPa
    })
  }
  else{
  var errors = request.validationErrors();
      if (!errors) { // No validation errors
          var item = {
              username: request.sanitize('username').escape().trim(),
              password: request.sanitize('password').escape().trim()
          };
          global.logged_user = item.username;
	  global.hscore_user = item.hscore;
          var query = "select id from users where username='"+ item.username +"' and password='"+ item.password +"';";

          db.one(query)
              .then(function (row) {
                  // if item not found
                  if (row.length == 0) {
                      request.flash('error', 'username or password incorrect');
                      response.redirect('users/login')
                  }
                  else {
                      logged_user = query;
                      request.flash('success', 'Player found');
                      response.redirect('/users')
                  }
              })
              .catch(function (err) {
                  request.flash('error', 'username or password incorrect');
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
      }
});

app.get('/game', function (request, response) {
  // render views/users/game.ejs
      response.render('users/game', {score: ''})

});

app.get('/submit_score', function (request, response) {
    //global.score_user = ss;
    var updateQuery = "UPDATE users SET hscore = '"+ "0" +"' WHERE username = '"+ global.logged_user +"';";
    if (global.score_user){if(score_user>hscore_user){
	updateQuery = "UPDATE users SET hscore = '"+ "0" +"' WHERE username = '"+ logged_user +"';";
	}}
       // Running SQL query to insert data into the store table
    console.log(updateQuery);
       db.none(updateQuery)
           .then(function (result) {
 	   response.redirect('/users')
	})
        .catch(function (err) {response.redirect('/')})
    //response.render('users/submit_score')
});

// route to edit an item
app.get('/edit/(:id)', function (request, response) {
   // Fetch the id of the item from the request.
   var itemId = request.params.id;

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

app.put('/edit/(:id)', function (req, res) {
   // Validate user input - ensure non emptiness
   var testId = req.body.id;
   var testUs = req.body.username;
   var testPa = req.body.password;
   console.log(testUs.length);
   console.log(testPa.length);
   console.log(testId);
   console.log(testUs);
   console.log(testPa);
   if(testUs.length==0 || testPa.length==0){
     req.flash('error', 'neither field may be empty');
     res.render('users/edit', {
         title: 'Edit Player',
         id: testId,
         username: '',
         password: ''
     })
   }
   else{
   var errors = req.validationErrors();
   if (!errors) { // No validation errors
       var item = {
           username: req.sanitize('username').escape().trim(),
           password: req.sanitize('password').escape().trim()
       };
       // Fetch the id of the item from the request.
       var itemId = req.params.id;
       var User = item.username;
       var Password = item.password;
       var act_Id = global.logged_user;
       var check = "SELECT * FROM users WHERE username = '"+ item.username + "';"
       db.one(check)
        .then(function(nrow){
          if(nrow.length!=0 && item.username==act_Id){
            /* each person has a unique username and id so if we find that
            that (row.length!=0) then we know a user has this name but if
            (nrow.username==act_Id) we know that the user didn't change their
            "username" so we only need to update their password.*/
            var updateQuery = "UPDATE users SET password = '"+ item.password +"' WHERE id = "+ nrow.id +";";
            db.none(updateQuery)
              .then(function (result) {
                  req.flash('success', 'Data updated successfully!');
                  res.redirect('/users');
              })
              .catch(function (err) {
                  req.flash('error', err);
                  res.render('users/edit', {
                      title: 'Edit Player',
                      id: nrow.id,
                      username: nrow.username,
                      password: nrow.password
                  })
              })
          }
          else if(nrow.length!=0 && item.username!=act_Id){
            /*this means that the user trying to change their username
            changed it to an already taken username*/
            req.flash('error', 'A player already has the username: '+ item.username);
            res.render('users/edit', {
                title: 'Edit Player',
                id: nrow.id,
                username: nrow.username,
                password: nrow.password
            })
          }
          else{
            // this doesn't run when (nrow.length==0) we go to
            // the .catch that's attached to the .then
            req.flash('error', 'Unkown Error Occurred');
            res.render('users/edit', {
                title: 'Edit Player',
                id: nrow.id,
                username: nrow.username,
                password: nrow.password
            })
          }
       })
       .catch(function (err) {
         /* the .catch() gets called when nrow==0 and this means
         that there are currently no users who have that username*/
         var catchId = req.params.id;
         var updateQ = "UPDATE users SET username = '"+ item.username +"', password = '"+ item.password +"' WHERE id = "+ catchId +";";
         db.none(updateQ)
           .then(function (result) {
               req.flash('success', 'Data updated successfully!');
               global.logged_user = item.username;
               res.redirect('/users');
           })
           .catch(function (err) {
               req.flash('error', err);
               res.render('users/edit', {
                   title: 'Edit Player',
                   id: req.body.id,
                   username: req.body.username,
                   password: req.body.password
               })
           })
        })
     }
   else {
       var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
       req.flash('error', error_msg);
       res.render('users/edit', {
           title: 'Edit Player',
           id: req.body.id,
           username: req.body.username,
           password: req.body.password
       })
   }
 }
});

// Route to delete an item. Notice that request method is DELETE here
app.delete('/delete/(:id)', function (req, res) {
    // Fetch item id of the item to be deleted from the request.
    var itemId = req.params.id;

    var deleteQuery = 'DELETE FROM users WHERE id = '+ itemId +';';
    db.none(deleteQuery)
        .then(function (result) {
                  req.flash('success', 'successfully deleted it');
                  res.redirect('/');
        })
        .catch(function (err) {
                   req.flash('error', err);
                   res.redirect('/users')
        })
});
