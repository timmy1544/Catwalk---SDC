const router = require('express').Router();
const controller = require('../controllers/reviews.js');

router.get('/:product_id', controller.getOne);
router.get('/meta/:product_id', controller.getReviewMetadata);
router.post('/:product_id', controller.addReview);
router.put('/:reviews_id/helpful', controller.markHelpful);
router.put('/:reviews_id/report', controller.reportReview);

module.exports = router;