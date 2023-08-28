const containsAtLeastHalfWords = (longStr, smallStr) => {
  const smallWords = smallStr.toLowerCase().split(' ');
  let countMatches = 0;

  for (let word of smallWords) {
    if (longStr.toLowerCase().includes(word)) {
      countMatches++;
    }
  }

  return countMatches >= Math.ceil(smallWords.length / 2);
};

const searchName = (title, datas) => {
  for (let index in datas.results) {
    const data = datas.results[index];
    if (containsAtLeastHalfWords(title, data.name)) {
      return {
        rating: data.rating,
        totalRatings: data.user_ratings_total,
        link: `https://google.com/search?q=${title}`
      };
    }
  }
  return { notFound: true };
};

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  console.log('msg', msg);
  fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${msg.practicien}&key=API_KEY`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log('data', data);
      const result = searchName(msg.practicien, data);
      sendResponse({ ...result });
    })
    .catch((err) => console.error(err));
  return true;
});
