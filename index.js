let SERVER_NAME = 'product-api'
let PORT = 5000;
let HOST = '127.0.0.1';

let errors = require('restify-errors');
let restify = require('restify')
    productsSave = require('save')('products')

  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log("EndPoints : - ");
  console.log(server.url + "/products : METHOD: GET, POST");
  console.log(server.url + "/products/:id : METHOD: GET, PUT, DEL");
})
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());


// Counter variables for GET, PUT, DELETE and POST Api's
let getApiCount = 0;
let postApiCount = 0;
let putApiCount = 0;
let delApiCount = 0;


// GET request Api (All Products)
server.get('/products', function (req, res, next) {
  console.log("GET Api : received request");
  // Find every product within the given collection
  productsSave.find({}, function (error, products) {
    getApiCount++;
    console.log("GET Api : sending response");
    console.log( "Api Count -> Get : " + getApiCount + ", Post : " + postApiCount + ", PUT : " + putApiCount +
        ", DEL : " +delApiCount
    );
    // Return all of the products in the memory collection
    res.send(products)
  })
})

// Get a single product by their product id
server.get('/products/:id', function (req, res, next) {
  console.log("GET Api : received request with parameters : " + JSON.stringify(req.params));

  // Find a single product by their id within memory
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error)
    {
        res.send(404);
        return next(new Error(JSON.stringify(error.errors)));
    }
    if (product) {
      getApiCount++;
      console.log("GET Api : sending response");
      console.log( "Api Count -> Get : " + getApiCount + ", Post : " + postApiCount + ", PUT : " + putApiCount +
          ", DEL : " + delApiCount
      );
      // Send the product if no issues
      res.send(product)
    } else {
      // Send 404 Error if the product does not exist
      res.send(404)
    }
  })
})

// Api to post a new product item
server.post('/products', function (req, res, next) {
  console.log('Post Api : received request with params' + JSON.stringify(req.params));
  console.log('Post Api : received request with body' + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.productId === undefined ) {
    return next(new errors.BadRequestError('Product Id is not provided'))
  }
  if (req.body.price === undefined ) {
    return next(new errors.BadRequestError('Price is not provided'))
  }
  if (req.body.name === undefined ) {
    return next(new errors.BadRequestError('Name is not provided'))
  }
  if (req.body.quantity === undefined ) {
    return next(new errors.BadRequestError('Quantity is not provided'))
  }

  let newProduct = {
		productId: req.body.productId, 
		name: req.body.name,
    price : req.body.price,
    quantity : req.body.quantity
  }

  // Creating the product 
  productsSave.create( newProduct, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))
    postApiCount++;
    console.log("Post Api : sending response");
    console.log( "Api Count -> Get : " + getApiCount + ", Post : " + postApiCount + ", PUT : " + putApiCount +
        ", DEL : " + delApiCount
    );
    // Send the product if there are no issues
    res.send(201, product)
  })
})

// Update a product by their id using put Api method
server.put('/products/:id', function (req, res, next) {
  console.log('PUT product Api : received request with params' + JSON.stringify(req.params));
  console.log('PUT product Api : received request with body' + JSON.stringify(req.body));
  // validation of manadatory fields
  if (req.body.productId === undefined ) {
    return next(new errors.BadRequestError('Product Id is not provided'))
  }
  if (req.body.price === undefined ) {
    return next(new errors.BadRequestError('Price is not provided'))
  }
  if (req.body.name === undefined ) {
    return next(new errors.BadRequestError('Name is not provided'))
  }
  if (req.body.quantity === undefined ) {
    return next(new errors.BadRequestError('Quantity is not provided'))
  }
  let newProduct = {
    _id: req.params.id,
		productId: req.body.productId, 
		name: req.body.name,
    price : req.body.price,
    quantity : req.body.quantity
  }
  
  // Updating the product
  productsSave.update(newProduct, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))
    console.log("products PUT: sending response");
    putApiCount++;
    console.log( "Api Count -> Get : " + getApiCount + ", Post : " + postApiCount + ", PUT : " + putApiCount +
    ", DEL : " + delApiCount);
    // Send a 200 OK response
    res.send(200,newProduct)
  })
})

// Delete product with the given id in parameter using Delete method
server.del('/products/:id', function (req, res, next) {
  console.log('Delete product Api : received request with params' + JSON.stringify(req.params));
  // Deleting the product
  productsSave.delete(req.params.id, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)))
    console.log("Item deleted successfully");
    delApiCount++;
    console.log( "Api Count -> Get : " + getApiCount + ", Post : " + postApiCount + ", PUT : " + putApiCount +
    ", DEL : " + delApiCount);

     // Send a 204 response
     res.send(200,JSON.stringify({success:true, message:"Item deleted successfully"}))
  })
})


