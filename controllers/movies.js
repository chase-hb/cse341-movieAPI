const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


// async function responseHandler(result, res){
//   console.log("--Response handler--");
//   res.setHeader('Content-Type', 'application/json');
//   const resultArray = await result.toArray();
//   res.status(200).json( resultArray[0] );
// }

async function getAll (req, res, next){

  const movieId = new ObjectId(req.params.id);
  const dbQuery = await mongodb.getDb().db().collection('movies').find();

  console.log("--Getting all movies--")
  res.setHeader('Content-Type', 'application/json');
  const resultArray = await dbQuery.toArray();
  res.status(200).json(resultArray);

}

async function getSingle (req, res, next){

  const movieId = new ObjectId(req.params.id);
  const dbQuery = await mongodb.getDb().db().collection('movies').find({ _id: movieId });

  
  //console.log( await result.toArray() );

  console.log("--Getting one movie--")
  res.setHeader('Content-Type', 'application/json');
  const resultArray = await dbQuery.toArray();
  res.status(200).json(resultArray[0]);



  // await responseHandler(dbQuery, res);

}

async function addMovie (req, res, next){

  console.log("--Creating Contact--")

  const dbQuery = await mongodb.getDb().db().collection('movies').insertOne({
    title: req.body.title,
    releaseYear: req.body.releaseYear,
    genre: req.body.genre,
    director: req.body.director,
    rating: req.body.rating,
    writer: req.body.writer,
    cinematographer: req.body.cinematographer
  });

  if (dbQuery.acknowledged){
    console.log("Contact with ID: " + dbQuery.insertedId + " added.")
    res.status(201).json(dbQuery)
  } else{
    console.log("ERROR! Contact creation failed.")
    res.status(500).json(dbQuery)
  }

}



async function updateMovie (req, res, next){

  const movieId = new ObjectId(req.params.id);
  console.log("--Updating Contact '" + movieId + "' --")

  const dbQuery = await mongodb.getDb().db().collection('movies').replaceOne({ _id: movieId }, {
    title: req.body.title,
    releaseYear: req.body.releaseYear,
    genre: req.body.genre,
    director: req.body.director,
    rating: req.body.rating,
    writer: req.body.writer,
    cinematographer: req.body.cinematographer
  });

  if (dbQuery.acknowledged){
    if(dbQuery.matchedCount > 0){
      console.log("Found " + dbQuery.matchedCount + " matches.");
      console.log(dbQuery.modifiedCount + " item(s) modified.")
      res.status(201).json(dbQuery)
    } else{
      console.log("Sorry, no matches found for ID: " + movieId);
      console.log("No modifications made.")
      res.status(204).send();
    }
    
  } else{
    console.log("ERROR! Movie update failed.")
    res.status(500).json(dbQuery)
  }
  
  

}


async function deleteMovie (req, res, next){

  const movieId = new ObjectId(req.params.id);
  const dbQuery = await mongodb.getDb().db().collection('movies').deleteOne({ _id: movieId }, true);

  console.log("--Deleting contact '" + movieId + "' --");

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

module.exports = { getAll, getSingle, addMovie, updateMovie, deleteMovie};

