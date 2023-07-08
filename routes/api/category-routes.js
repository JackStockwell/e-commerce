// Imports
const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET request, will retrieve all categories with products attachments. 
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: Product
    });
    
    // Success response
    return res.status(200).json(categoryData);

  // Error catch
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET method id request, will request data from the db with the product model included
// Searches the db with the parsed id in the params.
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: Product
    });
    res.status(200).json(categoryData);

    // Checks to see if there is a record or not, if no record with id returns 404 error.
    if (!categoryData) {
      res.status(404).json({ message: 'Error 404, no id found!'})
      return;
    }
    
    // Success Response
    return res.status(200).json(categoryData);

  // Error Catch
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST method request, will add a new category to the DB.
router.post('/', async (req, res) => {
  /*
  req.body example:
    {
      "category_name": "example"
    }
  */

  try {
    const newCategory = await Category.create({
      // Parsed in body.category_name.
      category_name: req.body.category_name
    });

    // Success response
    return res.status(200).json({
      message: "Successfully added new category",
      new_category: newCategory
    });

  // Error catch
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT method request, will updated a record in the db with matching id with the req.body
router.put('/:id', async (req, res) => {
  /*
  req.body example:
    {
      "category_name": "example"
    }
  */
  try {
    const updateCategory = await Category.update({
      // Updates the category name with the data from the request body.
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id
        }
      });
    
    // Checks to see if there is a record or not, if no record with matching id returns 404 error.
    if (!updateCategory) {
      res.status(404).json({ message: 'Error 404, no id found!'})
      return;
    };
    
    // Success response
    return res.status(200).json({
      message: `Updated category id ${req.params.id}`,
      update: {
        new_category: `${req.body.category_name}`
      }
    });
  
  // Error catch
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE method request, deletes a record from the data that matches the id parsed in the parameters
router.delete('/:id', async (req, res) => {
  try {
    const deleteCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    // Checks to see if there is a record or not, if no record with matching id returns 404 error.
    if (!deleteCategory) {
      res.status(404).json({ message: `Error 404, category id of '${req.params.id}' not found!`})
      return;
    }
    
    // Success response
    return res.status(200).json({
      message: "Successfully deleted category!"
    });
  
  // Error catch
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
