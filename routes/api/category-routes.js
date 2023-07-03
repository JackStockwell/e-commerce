const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll();
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Location.findByPk(req.params.id, {
      include: [{ model: Category} , { model:Product}]
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Error 404, no id found!'})
      return;
    }
    
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  Category.create(req.body)
    .then((category) => {
      
    })
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
