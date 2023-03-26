const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
        {
          model: Tag,
          attributes: ["id", "tag_name"],
          through: ProductTag,
          as: "tags",
        },
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        {
          model: Tag,
          as: "tags",
          through: ProductTag,
          attributes: ["id", "tag_name"],
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    await newProduct.setTags(req.body.tagIds);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updatedProduct[0]) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    const product = await Product.findByPk(req.params.id);
    if (req.body.tagIds) {
      await product.setTags(req.body.tagIds);
    }
    res.json({ message: "Product updated successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete one product
router.delete("/:id", async (req, res) => {
  try {
    const productToDelete = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productToDelete) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    res.json({ message: "Product deleted successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
