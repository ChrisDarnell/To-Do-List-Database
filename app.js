//jshint esversion:6

const e = require("express");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Mongoose

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

// Default Items for DB Testing

const item1 = new Item({
  name: "Gym"
});

const item2 = new Item({
  name: "Tan"
});

const item3 = new Item({
  name: "Laundry"
});

const defaultItems = [item1, item2, item3];

// Express

app.get("/", function (req, res) { 

  Item.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Success! Default items saved to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

// Delete

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Item Deleted Successfully.");
        res.redirect("/");
      }
    });
});


app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});