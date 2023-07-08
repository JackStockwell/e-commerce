const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: Product
    });
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: Product
    });
    res.status(200).json(categoryData);

    if (!categoryData) {
      res.status(404).json({ message: 'Error 404, no id found!'})
      return;
    }
    
    return res.status(200).json(categoryData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {

  try {
  const newCategory = await Category.create({
    category_name: req.body.category_name
  });

  return res.status(200).json(newCategory);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateCategory = await Category.update({
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id
        }
      });
    res.status(200).json(updateCategory);

    if (!updateCategory) {
      res.status(404).json({ message: 'Error 404, no id found!'})
      return;
    };
    
    return res.status(200).json({
      message: `Updated category id ${req.params.id}`,
      update: {
        new_category: `${req.body.category_name}`
      }
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteCategory = await Category.destroy(req.params.id);
    res.status(200).json(deleteCategory);

    if (!deleteCategory) {
      res.status(404).json({ message: `Error 404, category id of '${req.params.id}' not found!`})
      return;
    }
    
    return res.status(200).json({
      message: "Successfully delete category!"
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
