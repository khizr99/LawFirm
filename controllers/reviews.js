const Lawfirm = require('../models/lawfirm');
const Review = require('../models/review');

module.exports.createReview = async (req,res) =>{
    const lawfirm =  await Lawfirm.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    lawfirm.reviews.push(review);
    await review.save();
    await lawfirm.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/lawfirms/${lawfirm._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Lawfirm.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/lawfirms/${id}`);
}