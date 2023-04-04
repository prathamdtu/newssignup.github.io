const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const app=express();
const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));





app.post("/",function(req,res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    const data = {                              //mailchimp stores the data in this format
        members:[
            {
            email_address: email,
            status:"subscribed",
            merge_fields:{
            FNAME:firstName,
            LNAME:lastName,
            }
        }
    ]
};

const jsonData = JSON.stringify(data);

const url = "https://us13.api.mailchimp.com/3.0/lists/f0daea8743";

const options={
    method:"POST",
    auth:"pratham1:36bcf75016f59d97454b063d9109cf3c-us13"
}
const request = https.request(url,options,function(response){       //saving our data in a request named constant so that we can sent it to mailchimp server. 

    if(response.statusCode === 200){
        res.sendFile(__dirname +"/success.html");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){                       //to check the data that the user has sent to our server
        console.log(JSON.parse(data));                       // shows the users data.
    });
});
request.write(jsonData);          //to send the data to mailchimp server
request.end();
    
});

app.post("/failure",function(req,res){             //so that we can redirect the user from the failure page to home page.
    res.redirect("/");
});
app.get("/",function(req,res){
    res.sendFile(__dirname +"/signup.html");
});
app.listen(process.env.PORT || 3000,function(){
    console.log("your server is tuned at 3000");
});

//api key
//36bcf75016f59d97454b063d9109cf3c-us13

//list id 
//f0daea8743