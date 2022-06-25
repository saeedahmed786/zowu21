const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinary');
const Post = require('../Models/postModel');
var fs = require('fs');

exports.getAllPosts = async (req, res) => { 
  const posts = await Post.find().populate('user comments.user').sort({ createdAt: -1 }).exec();
  if (posts) {
    res.status(200).send(posts);
  } else {
    res.status(404).json({ errorMessage: 'No Posts found!' });
  }
}

exports.searchPost = async (req, res) => {
  const posts = await Post.find({ description: req.body.searchText }).populate('user comments.user').sort({ createdAt: -1 }).exec();
  if (posts) {
    res.status(200).send(posts);
  } else {
    res.status(404).json({ errorMessage: 'No Posts found!' });
  }
}


exports.getAllPostsByUserId = async (req, res) => {
  const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 }).populate('user comments.user').exec();
  if (posts) {
    res.status(200).send(posts);
  } else {
    res.status(404).json({ errorMessage: 'No Posts found!' });
  }
}

exports.getPostById = async (req, res) => {
  const findPost = await Post.findOne({ _id: req.params.id }).populate('user').exec();
  if (findPost) {
    res.status(200).send(findPost);
  }
}

exports.uploadPost = async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Zowu/Posts')
  let newPath;
  const { path } = req.file;
  newPath = await uploader(path)
  fs.unlinkSync(path);
  const post = new Post({
    description: req.body.description,
    category: req.body.category,
    file: newPath,
    user: req.user._id
  });

  await post.save(((error, result) => {
    if (result) {
      res.status(200).send({ successMessage: 'Post uploaded successfully', result });
    }
    else {
      res.status(400).json({ errorMessage: 'Failed to create Post. Please try again', error })
    }
  }))
}



exports.updatePost = async (req, res) => {
  const findPost = await Post.findById({ _id: req.params.id });
  console.log(findPost)
  if (findPost) {
    if (req.file) {
      const uploader = async (path) => await cloudinary.uploads(path, 'Zowu/Posts')
      const { path } = req.file;
      const newPath = await uploader(path)
      fs.unlinkSync(path);

      findPost.title = req.body.title;
      findPost.description = req.body.description;
      findPost.price = req.body.price;
      findPost.contactInfo = req.body.contactInfo;
      findPost.address = req.body.address;
      findPost.country = req.body.country;
      findPost.user = req.user._id;
      findPost.picture = newPath

      await findPost.save(((error, result) => {
        if (error) {
          res.status(400).json({ errorMessage: 'Failed to update Post. Please try again', error })
        }
        if (result) {
          res.status(200).send({ successMessage: 'Post updated successfully', result });
        }

      }))
    } else {
      findPost.title = req.body.title;
      findPost.description = req.body.description;
      findPost.price = req.body.price;
      findPost.contactInfo = req.body.contactInfo;
      findPost.address = req.body.address;
      findPost.country = req.body.country;
      findPost.user = req.user._id;
      findPost.picture = findPost.picture;
      await findPost.save(((error, result) => {
        if (error) {
          res.status(400).json({ errorMessage: 'Failed to update Post. Please try again', error })
        }
        if (result) {
          res.status(200).send({ successMessage: 'Post updated successfully', result });
        }

      }))
    }

  }
  else {
    res.status(404).json({ errorMessage: 'Post not found' });
  }

}


exports.deletePost = async (req, res) => {
  let post = await Post.findById({ _id: req.params.id });
  if (post) {
    const imgUrl = post.picture?.id;
    await cloudinaryCon.uploader?.destroy(imgUrl);
    post.remove();
    res.status(200).json({ successMessage: 'Post deleted successfully' });
  }
}



/************************ Views  **************************/
exports.addView = async (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { views: req.user._id } },
    function (error, success) {
      if (success) {
        res.status(200).send({ successMessage: 'Viewed!', success });
      }
      else {
        res.status(400).json({ errorMessage: 'Failed to view the post. Please try again', error })
      }
    });
}




/************************ Likes  **************************/
exports.addLike = async (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { likes: req.user._id } },
    function (error, success) {
      if (success) {
        res.status(200).send({ successMessage: 'Liked!', success });
      }
      else {
        res.status(400).json({ errorMessage: 'Failed to like the post. Please try again', error })
      }
    });
}

exports.removeLike = async (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { likes: req.user._id } },
    function (error, success) {
      if (success) {
        res.status(200).send({ successMessage: 'Removed Like!', success });
      }
      else {
        res.status(400).json({ errorMessage: 'Failed to remove like from the post. Please try again', error })
      }
    });
}




/************************ Comments  **************************/
exports.addComments = async (req, res) => {
  const comments = {
    text: req.body.text,
    user: req.user._id
  }
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { comments } },
    function (error, success) {
      if (success) {
        res.status(200).send({ successMessage: 'Comment added successfully', success });
      }
      else {
        res.status(400).json({ errorMessage: 'Failed to add comment. Please try again', error })
      }
    });
}


exports.getAllCommentsByPostId = async (req, res) => {
  const comments = await Post.find().populate('user').exec();
  if (comments) {
    res.status(200).send(comments);
  } else {
    res.status(404).json({ errorMessage: 'No comments found!' });
  }
}


exports.deletePostComments = async (req, res) => {
  let comment = await Post.findById({ _id: req.params.id });
  if (comment) {
    comment.remove();
    res.status(200).json({ successMessage: 'Comment deleted successfully' });
  }
}