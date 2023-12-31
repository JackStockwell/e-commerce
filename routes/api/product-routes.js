const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products

// GET method request, will retrieve all Product data from the db.
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      // Only show relevant infomation to the response.
      attributes: ['id', 'product_name', 'price', 'stock'],
      // Include models Category and Tag
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        { 
          model: Tag,
          attributes: ['tag_name'],
        }
      ],
    });

    // Success response
    return res.status(200).json(productData);

  // Error catch
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET one product by id
router.get('/:id', async (req, res) => {
  // Includes Category and Tag models
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag}]
    });

    // Check to see if there is an id match by checking to see if data was returned, will return 404 error
    if (!productData) {
      res.status(404).json({ message: 'Error 404, no id found!'})
      return;
    }
    // Success response
    return res.status(200).json(productData);
  
  // Error catch
  } catch (err) {
    return res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category: 1,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json({
      message: `New product \'${req.body.product_name}\' created`,
      tags: productTagIds
    }))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json({
        message: `Updated product id of \'${req.params.id}\'!`,
        data: req.body
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    
    if (!productData) {
      return res.status(404).json({message: "No matching ID found!"})
    }
    
    // Success response
    return res.status(200).json({
      message: "Successfully deleted product"
    });
  // Error Catch
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
