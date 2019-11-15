### Source Code for CMSC 447 Project

UI Setup:

    cd ./bpd_ui
    npm install
    npm start

UI Build:

    cd ./bpd_ui
    npm run build

API Setup:

Open the ./api project in Eclipse.
Select Run As -> Maven Install
Select Run As -> Java Application

Database Setup:

Install MySQL
Run ./sql_scripts/create_db.sql
Run python ./sql_scripts/pull_from_csv.py