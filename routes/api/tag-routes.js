const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET Request, will retrieve all Tag table data from the DB.
router.get('/', async (req, res) => {
  try {
    const tagsData = await Tag.findAll();
    res.status(200).json(tagsData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {

  try {
    const newTag = await Tag.create(req.body, {
      tag_name: req.body.tag_name
    })
    
    return res.status(200).json(newTag);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, {
      where: {
       id: req.params.id,
      }
    })

    if (!updatedTag) {
      res.status(404).json({
        message: 'Error 404, no id found!'
      })
      return;
    }

    res.status(200).json(updatedTag);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
