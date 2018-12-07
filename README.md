TeamParadise_Code
=======

### Database
For final project our database name is __finalproject__ <br />
table name is __users__
to check the database type


### TO CHECK LOCALHOST:
open terminal in "FinalProject" directory and type:
```
node server.js
```

then put the http link into google chrome
```
psql -U postgres -h localhost
```

The password is __postgres__

then type: 
```
"\c finalproject"
```

and it will bring you into the database. You can type 
```
SELECT * FROM finalproject;
```
to see the contents of the database.

__NOTE:__ to exit out of database press 
```
Ctrl + D
```

IF YOU WANT TO RESET "users" TABLE:

open terminal in "FinalProject" directory and type 
```
sudo su postgres
psql finalproject < database.sql
```
