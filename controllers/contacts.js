const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


// async function responseHandler(result, res){
//   console.log("--Response handler--");
//   res.setHeader('Content-Type', 'application/json');
//   const resultArray = await result.toArray();
//   res.status(200).json( resultArray[0] );
// }

async function getAll (req, res, next){

  const userId = new ObjectId(req.params.id);
  const dbQuery = await mongodb.getDb().db().collection('Contacts').find();

  console.log("--Getting all contacts--")
  res.setHeader('Content-Type', 'application/json');
  const resultArray = await dbQuery.toArray();
  res.status(200).json(resultArray);

}

async function getSingle (req, res, next){

  const userId = new ObjectId(req.params.id);
  const dbQuery = await mongodb.getDb().db().collection('Contacts').find({ _id: userId });

  
  //console.log( await result.toArray() );

  console.log("--Getting one contact--")
  res.setHeader('Content-Type', 'application/json');
  const resultArray = await dbQuery.toArray();
  res.status(200).json(resultArray[0]);



  // await responseHandler(dbQuery, res);

}

async function createContact (req, res, next){

  console.log("--Creating Contact--")

  const dbQuery = await mongodb.getDb().db().collection('Contacts').insertOne({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  });

  if (dbQuery.acknowledged){
    console.log("Contact with ID: " + dbQuery.insertedId + " added.")
    res.status(201).json(dbQuery)
  } else{
    console.log("ERROR! Contact creation failed.")
    res.status(500).json(dbQuery)
  }

}



async function updateContact (req, res, next){

  const userId = new ObjectId(req.params.id);
  console.log("--Updating Contact '" + userId + "' --")

  const dbQuery = await mongodb.getDb().db().collection('Contacts').replaceOne({ _id: userId }, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  });

  if (dbQuery.acknowledged){
    if(dbQuery.matchedCount > 0){
      console.log("Found " + dbQuery.matchedCount + " matches.");
      console.log(dbQuery.modifiedCount + " item(s) modified.")
      res.status(201).json(dbQuery)
    } else{
      console.log("Sorry, no matches found for ID: " + userId);
      console.log("No modifications made.")
      res.status(204).send();
    }
    
  } else{
    console.log("ERROR! Contact update failed.")
    res.status(500).json(dbQuery)
  }
  
  

}


async function deleteContact (req, res, next){

  const userId = new ObjectId(req.params.id);
  const dbQuery = await mongodb.getDb().db().collection('Contacts').deleteOne({ _id: userId }, true);

  console.log("--Deleting contact '" + userId + "' --");

  if (dbQuery.deletedCount > 0){
    console.log(dbQuery.deletedCount + " item(s) removed");
    res.status(204).send();
  } else if (dbQuery.acknowledged){
    console.log("ERROR! Delete process did not succeed. Maybe that ID doesn't exist?");
    res.status(500).json(dbQuery);
  } else{
    console.log("ERROR! Delete process did not succeed.");
    res.status(500).json(dbQuery);
  }

}

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact};

