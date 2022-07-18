//jshint esversion: 8

const express = require("express");
const https = require('https');
const client = require("@mailchimp/mailchimp_marketing"); // Needed for Mailchamp to work

const app = express();
var port = 3000
// Needed for Mailchamp to work
client.setConfig({
  apiKey: "e88aca965b1fa3b7da598ae8289c9774-us9",
  server: "us9",
});

app.use(express.static("public")); // static ensures any files made work from the specified dir
app.use(express.json()); // express took over bodyParser
app.use(express.urlencoded({
  extended: true
})); // extended true uses any urlencoded type not just string

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };
  const run = async () => { // Needed for Mailchamp to work
    const response = await client.lists.addListMember("11a6daaeb7", {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      } // Creates a new member to a list in Mailchamp
    });
    console.log(response.statusCode);
// If else statements to trigger success or failure
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run(); //mailchimp's stupid non user friendly adding members code
});
// Failure will send user to failure.html
app.post("/failure.html", function(req, res) {
  res.redirect("/")
});


app.listen(process.env.PORT || port, function() {
   console.log(`The server launched in http://localhost:${port}`);
});


// apikey = e88aca965b1fa3b7da598ae8289c9774-us9

// listid = 11a6daaeb7
//
// mailchimp endpoint
// https://us9.mailchimp.com/account/api/


// const data = {
//   members: [{
//       email_address: email,
//       status: 'subscribed',
//       merge_fields: {
//         FNAME: firstName,
//         LNAME: lastName
//       }
//
//     }
//
//
//   ]
// };
// const jsonData = JSON.stringify(data);
//
// const url = 'https://us6.mailchimp.com/account/api/lists/11a6daaeb7';
//
// const options = {
//   method: 'POST',
//   auth: 'brandon1:e88aca965b1fa3b7da598ae8289c9774-us9'
// }
//
// const request = https.request(url, options, function(response) {
//   response.on('data', function(data) {
//     console.log(JSON.parse(data));
//   })
// })
// request.write(jsonData);
// request.end();
