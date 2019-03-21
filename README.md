# School-grading
An app for teachers to track students' marks

https://school-grading.firebaseapp.com/students
## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment notes on how to deploy the project on a live system.

Install ionic according to the Ionic official website.
https://ionicframework.com/getting-started#cli

I will update you with other necessary installations.
## Deploying the app
Type this command in your local folder directory
```
ionic serve
```
## Built with
* [Ionic 4] (https://ionicframework.com/) - The framework used
* [Firebase] (https://firebase.google.com/) - NoSQL database
* [RxJS] (https://www.learnrxjs.io/) - Library for reactive programming
## Current lack of features/deficiencies
* Unable to join NoSQL table, the Mark with Subject (so the names of the subject will be represented by their ids) 
* Unable to have more than one mark for a subject card (doesn't have time to code for more complex functionality). But you can add similar subject cards inside a student with different marks if you need to add more than 1 mark.
* Unable cascade delete marks from deleting student or subject
## Author
* **Yosafat Chandra Saputra** - *Initial work*
