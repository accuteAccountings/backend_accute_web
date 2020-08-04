const route = require("express").Router();
const { Products } = require("../../db/db");
const { auth } = require("../../middleware/auth");

route.post("/", auth, (req, res) => {
  const prod = Products.create({
    UserId: req.user.id,
    product_name: req.body.product_name,
    hsn_num: req.body.hsn_num
  })
    .then(p => {
      res.status(201).send({ product: p });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Internal Error" });
    });
});

route.put("/", auth, (req, res) => {
  const prod = Products.findOne({
    where: {
      UserId: req.user.id,
      id: req.body.id
    }
  })
    .then(p => {
      p.product_name = req.body.product_name;
      p.hsn_num = req.body.hsn_num;

      p.save()
        .then(() => {
          res.status(201).send({ product: p });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({ error: "Internal Error" });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Internal Error" });
    });
});

route.get("/", auth, (req, res) => {
  let allUserPro = Products.findAll({
    where: {
      UserId: req.user.id
    },
    order: [["createdAt", "ASC"]]
  })
    .then(p => {

      if(req.query.mode == 'oldest'){
        p = p.sort(function (a, b) {
          return a.createdAt - b.createdAt;
        }); 
      }else if(req.query.mode == 'newest'){
        p = p.sort(function (a, b) {
          return b.createdAt - a.createdAt;
        })
     
   
      }

      res.status(200).send({
        Products: p
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        error: err
      });
    });

});

route.delete("/:id", auth, (req, res) => {
  let id = req.params.id;

  Products.destroy({
    where: {
      UserId: req.user.id,
      id
    }
  })
    .then(re => {
      res.status(201).send({
        deleted: `Product(${id})`
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        error: "Internal Error"
      });
    });
});

module.exports = { route };
