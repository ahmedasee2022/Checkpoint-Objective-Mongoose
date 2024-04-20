require('dotenv').config(); // Import dotenv to load environment variables
const mongoose = require('mongoose');

// Connect to MongoDB using the provided URI from the .env file
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name is required
  age: Number,
  favoriteFoods: [String] // Array of strings for favorite foods
});

// Create the Person model from the schema
const Person = mongoose.model('Person', personSchema);

// Create and Save a Record of a Model
const createAndSavePerson = (done) => {
  const newPerson = new Person({
    name: "John Doe",
    age: 30,
    favoriteFoods: ["Pizza", "Sushi"]
  });

  // Save the new person document
  newPerson.save((err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Create Many Records with model.create()
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Use model.find() to Search Your Database
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Use model.findOne() to Return a Single Matching Document from Your Database
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Use model.findById() to Search Your Database By _id
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Perform Classic Updates by Running Find, Edit, then Save
const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';

  Person.findById(personId, (err, person) => {
    if (err) return console.error(err);
    
    // Add "hamburger" to favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // Save the updated person
    person.save((err, updatedPerson) => {
      if (err) return console.error(err);
      done(null, updatedPerson);
    });
  });
};

// Perform New Updates on a Document Using model.findOneAndUpdate()
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName }, // Search criteria
    { age: ageToSet }, // Update
    { new: true }, // Options: return the updated document
    (err, updatedPerson) => {
      if (err) return console.error(err);
      done(null, updatedPerson);
    }
  );
};

// Delete One Document Using model.findByIdAndRemove
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return console.error(err);
    done(null, removedPerson);
  });
};

// MongoDB and Mongoose - Delete Many Documents with model.remove()
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return console.error(err);
    done(null, result);
  });
};

// Chain Search Query Helpers to Narrow Search Results
const queryChain = (done) => {
  const foodToSearch = "burritos";

  Person.find({ favoriteFoods: foodToSearch }) // Find people who like burritos
    .sort({ name: 1 }) // Sort them by name (ascending)
    .limit(2) // Limit the results to two documents
    .select('-age') // Hide their age
    .exec((err, data) => {
      if (err) return console.error(err);
      done(null, data);
    });
};

module.exports = {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain
};
