const db = require('../../database/index.js');
const { getOneHelper, getReviewMetadataHelper, addReviewHelper } = require('./reviewsHelper.js');
var async = require("async");

module.exports = {
  // return list of reviews for specific product
  getOne: (req, res) => {
    const id = req.params.product_id;
    const queryStr = `with table1 as (
                        SELECT
                          r.id as review_id,
                          product_id,
                          rating,
                          summary,
                          recommend,
                          response,
                          body,
                          date,
                          reviewer_name,
                          helpfulness,
                          url,
                          rp.id as photo_id
                        FROM reviews r
                        LEFT JOIN reviews_photos rp
                        ON r.id = rp.review_id
                        WHERE r.product_id = ${id}
                        ORDER BY 1,12
                      )
                      SELECT
                        product_id,
                        review_id,
                        rating,
                        summary,
                        recommend,
                        response,
                        body,
                        CONCAT(
                          to_timestamp(CAST(date AS bigint)/1000)::date,
                          'T',
                          to_timestamp(CAST(date AS bigint)/1000)::time without time zone,
                          'Z'
                        ) as date,
                        reviewer_name,
                        helpfulness,
                        string_agg(photo_id::varchar, ',') as photos_ids,
                        string_agg(url, ',') as photos_urls
                      FROM table1
                      GROUP BY 1,2,3,4,5,6,7,8,9,10
                      ORDER BY 1,2;`
    db.query(queryStr, (err, data) =>{
      if (err) {
        console.error('Failed to retrieve review');
        res.status(404).send(err);
      } else {
        console.log(`Successfully retrieve review id: ${id}`);
        const sendData = getOneHelper(id, data.rows);
        res.status(200).send(sendData)
      }
    })
  },

  // return review metadata for a given product
  getReviewMetadata: (req, res) => {
    const id = req.params.product_id;

    async.parallel([
      function(callback) {
        const queryStr1 = `SELECT
                            rating,
                            COUNT(rating) as count_rating,
                            SUM(CASE WHEN recommend IS true THEN 1 ELSE 0 END) as count_recommend,
                            SUM(CASE WHEN recommend IS false THEN 1 ELSE 0 END) as count_notRecommend
                            FROM reviews
                            WHERE product_id = ${id}
                            GROUP BY rating;`;
          db.query(queryStr1, callback);
      },
      function(callback) {
        const queryStr2 = `SELECT
                            characteristic_id,
                            name,
                            ROUND(AVG(value),4)::varchar as avg_value
                            FROM characteristic_review as cr
                            JOIN characteristics as c ON cr.characteristic_id = c.id
                            WHERE c.product_id = ${id}
                            GROUP BY 1,2
                            ORDER BY 1,2;`
        db.query(queryStr2, callback);
      }
    ],function(error, results){
      if (error) {
        console.error('Failed to retrieve meta data');
        res.status(404).send(error);
      } else {
        const sendData = getReviewMetadataHelper(id, results[0].rows, results[1].rows);
        res.status(200).send(sendData);
      }
    })
  },

  addReview: (req, res) => {
    const id = parseInt(req.params.product_id, 10);
    const {rating, summary, body, recommend,
    name, email, photos, characteristics } = req.body;

    let reviewBody = {
      product_id: id,
      rating: rating,
      summary: summary,
      body: body,
      recommend: recommend,
      name: name,
      email: email,
      photos: photos,
      characteristics: characteristics
    }

    const queryStr = `INSERT INTO reviews (
                        product_id,
                        rating,
                        date,
                        summary,
                        body,
                        recommend,
                        reviewer_name,
                        reviewer_email
                      )
                      VALUES (
                        $1,
                        $2,
                        trunc(extract(epoch from now() )*1000),
                        $3,
                        $4,
                        $5,
                        $6,
                        $7
                      )
                      RETURNING currval('reviews_id_seq');`;
    const queryArr_reviewInfo = [id, rating, summary, body, recommend, name, email];
    db.query(queryStr, queryArr_reviewInfo)
      .then(results => {
        const review_id = parseInt(results.rows[0].currval, 10);
        return review_id;
      })
      .then(review_id => {
        const queryStr_char = addReviewHelper(review_id, 'char', characteristics);
        db.query(queryStr_char, [])
          .then(() => {
            console.log('Successfully post char data');
          })
          .catch(err => {
            console.log('Failed to post char data');
          })
        return review_id;
      })
      .then(review_id => {
        const queryStr_photos = addReviewHelper(review_id, 'photos', photos);
        db.query(queryStr_photos, [])
          .then(() => {
            console.log('Successfully post photos data');
          })
          .catch(err => {
            console.log('Failed to post photos data');
          })
      })
      .then(() => {
        res.status(201).send('Successfully post the new review!');
      })
      .catch(err => {
        res.status(404).send(err);
      });

  },

  markHelpful: (req, res) => {
    // let review_id = req.body.review_id;
    const id = req.params.reviews_id;
    const queryStr = `UPDATE reviews
                      SET helpfulness = helpfulness + 1
                      WHERE reviews.id = ${id}; `
    db.query(queryStr, (err, data) =>{
      if (err) {
        console.error('Failed to mark review as helpful');
        res.status(404).send(err);
      } else {
        res.status(200).send(`Successfully mark review helpful, review id: ${id}`)
      }
    })
  },

  reportReview: (req, res) => {
    const id = req.params.reviews_id;
    const queryStr = `UPDATE reviews
                      SET reported = true
                      WHERE reviews.id = ${id}; `
    db.query(queryStr, (err, data) =>{
      if (err) {
        console.error('Failed to report the review...');
        res.status(404).send(err);
      } else {
        res.status(200).send(`Succesfully reported review, review id: ${id}`)
      }
    })
  }
}
