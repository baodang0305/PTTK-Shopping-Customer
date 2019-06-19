const ObjectId = require('mongodb').ObjectId;
const  mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    ProductId: {type: ObjectId},
    Username: String,
    Star: Number,
    Message: String,
    Time: String
}, {collection: 'Comment'});

const createNewComment = function(req){
    const tam = {
        Star: Number(req.body.star),
        Username: req.user ? req.user.Username : req.body.Name,
        Message: req.body.Message,
        Time: new Date().yyyymmdd(),
        ProductId: new ObjectId(req.body.ProductId)
    }
    return tam;
}

const changeStarFromIntToStringToEmbeddedToHandlebar = function(comment) {
    let commentAltered = {
        Star: numberofStarToString(comment.Star),
        Username: comment.Username,
        Message: comment.Message,
        Time: comment.Time,
        ProductId: comment.ProductId
    }
    return commentAltered
}


const numberofStarToString = function(numberOfStar) {
  var starList = ["-o", "-o", "-o", "-o", "-o"];
  for (let i = 0; i < Number(numberOfStar); i++) {
    starList[i] = "";
  }
  return starList
}

Date.prototype.yyyymmdd = function() {
  var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
  var dd = this.getDate().toString();

  return [this.getFullYear(), '-', mm.length===2 ? '' : '0', mm, '-', dd.length===2 ? '' : '0', dd].join(''); // padding
};

const comment = mongoose.model('comment', commentSchema);
 
module.exports = {
    'comment': comment,
    'changeStarFromIntToStringToEmbeddedToHandlebar': changeStarFromIntToStringToEmbeddedToHandlebar,
    'createNewComment': createNewComment
}

