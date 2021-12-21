const db = require('../../database/index.js');

module.exports = {

  getOneHelper: (id, data, page = 0, count = 5) => {

    const photosHelpers = (ids, urls) => {
      if(ids === null || urls === null ) {
        return [];
      }
      const arr = [];
      const ids_arr = ids.split(',');
      const urls_arr = urls.split(',');
      for (let i = 0; i < ids_arr.length; i++) {
        const photo = {
          id: ids_arr[i],
          url: urls_arr[i]
        }
        arr.push(photo);
      }
      return arr;
    }

    const results_arr = [];
    data.map(item => {
      const {review_id, rating, summary, recommend,
      body, date, reviewer_name, helpfulness, photos_ids, photos_urls} = item;
      const response = item.response === 'null' ? null : item.response;
      photos = photosHelpers(photos_ids, photos_urls);

      results_arr.push({
        review_id: parseInt(review_id, 10),
        rating: rating,
        summary: summary,
        recommend: recommend,
        response: response,
        body: body,
        data: date,
        reviewer_name: reviewer_name,
        helpfulness: helpfulness,
        photos: photos
      })
    });

    const returnObj = {
      product: id,
      page: page,
      count: count,
      results: results_arr,
    };

    return returnObj;
  },

  getReviewMetadataHelper: (id, data1, data2) => {
    const sendMetaData = {
      product_id: id,
      ratings:{},
      recommended:{
        0:0,
        1:0
      },
      characteristics:{}
    };

    // ratings and recommended object
    let recommend = 0;
    let notRecommend = 0;
    data1.map(item => {
      recommend += parseInt(item.count_recommend,10);
      notRecommend += parseInt(item.count_notrecommend,10);
      sendMetaData.ratings[item.rating] = parseInt(item.count_rating, 10);
    })
    sendMetaData.recommended[0] = notRecommend;
    sendMetaData.recommended[1] = recommend;

    // characteristics object
    data2.map(item => {
      sendMetaData.characteristics[item.name] = {
        id: parseInt(item.characteristic_id, 10),
        value: item.avg_value,
      }
    });

    return sendMetaData
  },

  addReviewHelper: (review_id, table, items) => {
    if (table === 'char') {
      let arr = [];
      for (let i in items) {
        arr.push(`(${i}, ${review_id}, ${items[i]})`);
      }
      arr = arr.join(',')
      const queryStr_char = `INSERT INTO public.characteristic_review(
                              characteristic_id, review_id, value)
                              VALUES ${arr};`;
      return queryStr_char;
    } else if (table === 'photos') {
      let arr = [];
      items.map(item => {
        arr.push(`(${review_id}, '${item}')`);
      });
      arr = arr.join(',')
      const queryStr_photos = `INSERT INTO public.reviews_photos(
                                review_id, url)
                                VALUES ${arr};`
      return queryStr_photos;
    }
  },




  getAverageRating: (productId) => {
  // let config = {
  //   headers: {
  //     'Authorization': TOKEN
  //   }
  // }

  // return axios.get(`${API_URL}/reviews/meta?product_id=${productId}`, config)
  //     .then(results => {
  //       let ratings = results.data.ratings;
  //       let ratingsCount = 0;
  //       let ratingsSum = 0;
  //       for (var rating in ratings) {
  //         ratingsCount += Number(ratings[rating]);
  //         ratingsSum += Number(rating) * Number(ratings[rating]);
  //       }
  //       let avgRating = Math.round((ratingsSum / ratingsCount) * 10) / 10;
  //       return avgRating;
  //     })
  //     .catch(err => {
  //       console.log('failed to retrieve metadata in helper')
  //     });
  },
};
