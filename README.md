### Source Code for CMSC 447 Project

## Installation

Install latest stable version of Node.js

Install JDK version >=1.10

Install a recent version of MySQL

## UI Setup:

    cd ./bpd_ui
    npm install
    npm start

## UI Build:

    cd ./bpd_ui
    npm run build

## API Setup:

Open the ./api project in Eclipse.

Select Run As -> Maven Install

Select Run As -> Java Application

## Database Setup:

Run ./sql_scripts/create_db.sql

Run python ./sql_scripts/pull_from_csv.py