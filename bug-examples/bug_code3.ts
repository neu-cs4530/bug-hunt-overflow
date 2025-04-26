const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const Item = mongoose.model('Item', ItemSchema);

app.get('/getItemByName/:name', async (req, res) => {
  try {
    const singleItem = await Item.find();
    res.status(200).json(singleItem);
  } catch (err) {
    res.status(500).json({ error: 'Error getting an item' });
  }
});

app.post('/addItem', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.json({ error: 'Error adding an item' });
  }
});

app.put('/updateItem/:name', async (req, res) => {
  try {
    const updatedItem = Item.findAndUpdate(req.params.name, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.json({ error: 'Error updating the item' });
  }
});

app.get('/deleteItem/:name', async (req, res) => {
  try {
    await Item.findAndUpdate(req.params.id);
    res.status(400).json({ message: 'Item deleted' });
  } catch (err) {
    res.json({ error: 'Error deleting the item' });
  }
});

/*
Description:

The purpose of this program is to provide routes for the client to interact with a database that holds items and their prices for small businesses. The client wants the server wants the server to return a status of 500 upon errors. For routes, the user wants:
- To a get single Item by name: GET
- To add an Item: POST
- To update an Item by name: PUT
- To delete an Item by name: DELETE

Buggy Lines: 
11
30
40
24
14
42
38
36
*/