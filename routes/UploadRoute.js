const { Router } = require("express");
const uploadMiddleware = require("../middlewares/MulterMiddleware");
const UploadModel = require("../models/UploadModel");

const router = Router();


//delete photo code:

const fs = require('fs'); // Node.js file system module
const path = require('path');

router.delete('/api/delete/:id', async (req, res) => {
  try {
    const photoId = req.params.id;
    // console.log(photoId);  
    const obj = await UploadModel.findById(photoId);
    if (!obj) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Delete the photo file from the server's file system
    const filePath = path.join(__dirname, '../public/uploads/', obj.photo);
    console.log(filePath);
    // fs.unlinkSync(filePath); //currrently not deleting from the server storgae due to some bugs
    await UploadModel.deleteOne( {_id: photoId});


    console.log('Photo deleted:', photoId);
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/api/get", async (req, res) => {
  const allPhotos = await UploadModel.find().sort({ createdAt: "descending" });
  console.log("fetchig completed")
  res.send(allPhotos);
});


router.get("/api/get/wildLife", async (req, res) => {
  const wildiLifePhotos = await UploadModel.find({ category: "WildLife" }).sort({ createdAt: "descending" });
  console.log("fetching wildLife completed");
  res.send(wildiLifePhotos);
});


router.get("/api/get/nature", async (req, res) => {
  const naturePhotos = await UploadModel.find({ category: "Nature" }).sort({ createdAt: "descending" });
  console.log("fetching nature completed");
  
  res.send(naturePhotos);
});

router.get("/api/get/human", async (req, res) => {
  const humanPhotos = await UploadModel.find({ category: "Human" }).sort({ createdAt: "descending" });
  console.log("fetching human completed");
  res.send(humanPhotos);
});

router.post("/api/save", uploadMiddleware.single("photo"), (req, res) => {
  const { category ,details,tags} = req.body;
  console.log(req.body);
  const photo = req.file.filename;

  console.log(photo);

  UploadModel.create({ photo, category,details,tags })
    .then((data) => {
      console.log("Uploaded Successfully...");
      console.log(data);
      res.send(data);
    })
    .catch((err) => console.log(err));
});

router.put('/api/updateLike/:id', async (req, res) => {
  try {
    const photoId = req.params.id;
    const obj = await UploadModel.findByIdAndUpdate(
      photoId,
      { $inc: { likeCount: 1 } }, // Increment likeCount by 1
      { new: true } // Return the updated document
    );

    if (!obj) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    console.log('Photo like updated:', photoId);
    // res.send({likeCount});
    res.json({ message: 'Like updated successfully' , likeCount: obj.likeCount});
  } catch (error) {
    console.error('Error updating like of photo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/api/getLikeCount/:id', async (req, res) => {
  try {
    const photoId = req.params.id;
    const obj = await UploadModel.findById(photoId);

    if (!obj) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json({ likeCount: obj.likeCount }); // Send the like count as a response
  } catch (error) {
    console.error('Error fetching like count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
