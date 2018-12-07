TeamParadise Code
=======

### Database
For final project our database name is __finalproject__ <br />
table name is __users__<br />

### To check Localhost:
Open terminal in "FinalProject" directory and type:
```
node server.js
```

Then put the http link into google chrome
```
psql -U postgres -h localhost
```

The password is __postgres__

Then type: 
```
"\c finalproject"
```

And it will bring you into the database. You can type 
```
SELECT * FROM finalproject;
```
To see the contents of the database.

__NOTE:__ To exit out of database press 
```
Ctrl + D
```

### If you want to reset "users" Table:

Open terminal in "FinalProject" directory and type 
```
sudo su postgres
psql finalproject < database.sql
```
