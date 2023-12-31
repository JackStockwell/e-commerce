// Imports
const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET Request, will retrieve all Tag table data from the DB.
router.get('/', async (req, res) => {
  try {
    // Finds all records, with the product model included
    const tagsData = await Tag.findAll({
      include: Product
    });
    return res.status(200).json(tagsData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET request, will retrieve a record from the db with a specified id.
router.get('/:id', async (req, res) => {
  try {
    // Finds the record in the db with the params id, includes product model.
    const tagData = await Tag.findByPk(req.params.id, {
      include: Product
    });
    return res.status(200).json(tagData);
  // Error Catcher
  } catch (err) {
    return res.status(500).json(err);
  }
});

// POST request, will post a new entree to the DB with the parsed body.
router.post('/', async (req, res) => {
  /*
  req.body example:
    {
      "tag_name": "example"
    }
  */
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name
    });
    // Success response, prints a message and the new tag entered to the DB.
    return res.status(200).json({
      message: "Successfully added new tag!",
      newtag_data: newTag
    });
  // Error Catch
  } catch (err) {
    return res.status(500).json(err);
  }
});

// UPDATE request, will find a record from the database with an id that matches the params.
// Will updated it with the req.body sent.
router.put('/:id', async (req, res) => {
  /*
  req.body example:
    {
      "tag_name": "example"
    }
  */
  try {
    const tagData = await Tag.update({
      tag_name: req.body.tag_name
    }, 
    {
      where: {
       id: req.params.id,
      }
    });

    // Checks for data, if false will return with 404 error
    if (!tagData) {
      res.status(404).json({
        message: 'Error 404, no id found!'
      })
      return;
    }

    // Success response
    return res.status(200).json({
      message: `Updated tag id ${req.params.id}`,
      update: {
        new_tag: `${req.body.tag_name}`
      }
    });

  // Error catch
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE request, deletes a record from the database that matches the id parsed.
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    // Checks to see if the data is true or not, will respond with a 404 error if no id found.
    if (!tagData) {
      res.status(404).json({ 
        message: "ERROR 404. 'id' not found"
      })
      return;
    };

    // Success response
    return res.status(200).json({
      message: "Successfully deleted tag"
    });
  
  // Error catch
  } catch (err) {
    return res.status(500).json(err)
  }
});

module.exports = router;
