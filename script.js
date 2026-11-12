/* =====================================================
   Daily Pulse - News / Blog Portal
   All the JavaScript for every page is in this file.
   ===================================================== */

// ---------- 1. Our default articles (an array of objects) ----------
var defaultArticles = [
  { id: 1, title: "New Smartphone Brings Week-Long Battery Life", category: "Technology", author: "Riya Sharma", date: "10 Nov 2026", icon: "📱", likes: 42,
    text: "A new smartphone launched this week promises battery life of up to seven days on a single charge. Engineers say a new type of battery material and a very efficient chip made this possible. Early reviewers are impressed, though many want to see how it performs after a few months of daily use." },
  { id: 2, title: "Schools Start Teaching Basic Coding from Class 5", category: "Technology", author: "Aman Verma", date: "09 Nov 2026", icon: "💻", likes: 35,
    text: "Many schools across the country have started teaching basic coding to students from Class 5. Children learn how to give instructions to a computer using simple block-based tools. Teachers believe this will improve problem solving skills and prepare students for the jobs of the future." },
  { id: 3, title: "Local Cricket Team Wins the State Championship", category: "Sports", author: "Karan Singh", date: "11 Nov 2026", icon: "🏏", likes: 58,
    text: "The Lucknow district cricket team won the state championship after a thrilling final match. The captain scored a century and the bowlers defended a small total on the last day. Thousands of fans gathered at the stadium to celebrate the victory with drums and fireworks." },
  { id: 4, title: "Young Athletes Shine at the National Games", category: "Sports", author: "Neha Gupta", date: "08 Nov 2026", icon: "🏃", likes: 27,
    text: "Several young athletes won medals at the national games this week. Coaches say better training facilities and early talent programs are starting to show results. Many of the winners are under eighteen and come from small towns, which shows that talent is found everywhere." },
  { id: 5, title: "Small Businesses See a Boom in Online Sales", category: "Business", author: "Pooja Mishra", date: "10 Nov 2026", icon: "🛍️", likes: 31,
    text: "Small shop owners are reporting a big rise in online sales before the festival season. Many of them learned to use social media and delivery apps in the last two years. Experts advise new sellers to keep good photos, honest descriptions and quick replies to customers." },
  { id: 6, title: "Stock Market Ends the Week on a Positive Note", category: "Business", author: "Rahul Yadav", date: "07 Nov 2026", icon: "📈", likes: 19,
    text: "The stock market closed the week higher as investors felt hopeful about company results. Banking and technology shares led the gains. Analysts remind new investors that prices go up and down, so it is wise to invest slowly and for the long term." },
  { id: 7, title: "Five Easy Habits for a Healthier Daily Routine", category: "Health", author: "Dr. Anjali Rao", date: "11 Nov 2026", icon: "🥗", likes: 64,
    text: "Doctors say small habits matter more than big plans. Drink enough water, walk for thirty minutes, sleep at least seven hours, eat fresh fruits and vegetables, and take short breaks from your phone. Doing these five things every day can improve energy, mood and concentration." },
  { id: 8, title: "Why Sleep Matters So Much for Students", category: "Health", author: "Dr. Sameer Khan", date: "06 Nov 2026", icon: "😴", likes: 38,
    text: "Students who sleep well remember more and feel less stressed. Late night screen time makes it harder to fall asleep. Health experts suggest switching off screens one hour before bed and keeping a fixed sleep time, even on holidays, to build a healthy body clock." },
  { id: 9, title: "Much Awaited Movie Breaks Opening Day Records", category: "Entertainment", author: "Isha Kapoor", date: "09 Nov 2026", icon: "🎬", likes: 47,
    text: "A big budget family movie broke opening day records at cinemas across the country. Audiences praised the music and the emotional story. Film critics gave it mostly positive reviews and predict that it will stay in theatres for many weeks." },
  { id: 10, title: "Music Festival Returns with Top Indie Bands", category: "Entertainment", author: "Vikas Joshi", date: "05 Nov 2026", icon: "🎸", likes: 22,
    text: "The yearly music festival is back with more than twenty indie bands and singers. Tickets for the three-day event are already half sold. Organisers promise food stalls, art corners and a special stage for college bands who want to perform in front of a big crowd." }
];

// ---------- 2. Small helper functions ----------

// Get a list (array) saved in localStorage. If nothing is saved, give an empty array.
function getList(key) {
  var saved = localStorage.getItem(key);
  if (saved) { return JSON.parse(saved); }
  return [];
}

// Save a list (array) in localStorage
function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

// New posts written by the user are saved under "userPosts"
// We put them FIRST so they show on top of the home page
function getAllArticles() {
  return getList("userPosts").concat(defaultArticles);
}

// Stops people from typing HTML tags into the form (safety)
function clean(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Reading time = number of words / 200 words per minute (rounded up)
function readingTime(text) {
  var words = text.trim().split(/\s+/).length;
  var minutes = Math.ceil(words / 200);
  if (minutes < 1) { minutes = 1; }
  return minutes;
}

// Total likes = starting likes + 1 if this user liked it
function likeCount(article) {
  var liked = getList("likedIds").indexOf(article.id) !== -1;
  if (liked) { return article.likes + 1; }
  return article.likes;
}

// Build the HTML of one article card
function makeCard(a) {
  var html = '<div class="card">';
  html += '<div class="thumb ' + a.category.toLowerCase() + '">' + a.icon + '</div>';
  html += '<div class="card-body">';
  html += '<span class="tag">' + a.category + '</span>';
  html += '<h3><a href="article.html?id=' + a.id + '">' + clean(a.title) + '</a></h3>';
  html += '<p>' + clean(a.text.substring(0, 90)) + '...</p>';
  html += '<small>By ' + clean(a.author) + ' | ' + a.date + ' | ' + readingTime(a.text) + ' min read | ♥ ' + likeCount(a) + '</small>';
  html += '</div></div>';
  return html;
}

// Show a list of articles inside the element with the given id
function showCards(list, boxId) {
  var box = document.getElementById(boxId);
  if (list.length === 0) {
    box.innerHTML = "<p>No articles found. Try a different search.</p>";
    return;
  }
  var html = "";
  for (var i = 0; i < list.length; i++) {
    html += makeCard(list[i]);
  }
  box.innerHTML = html;
}

// Filter articles by category and search text (used on Home and Categories)
function filterArticles(category, searchText) {
  var all = getAllArticles();
  var result = [];
  searchText = searchText.toLowerCase();
  for (var i = 0; i < all.length; i++) {
    var a = all[i];
    var categoryOk = (category === "All" || a.category === category);
    var searchOk = a.title.toLowerCase().indexOf(searchText) !== -1 ||
                   a.text.toLowerCase().indexOf(searchText) !== -1 ||
                   a.author.toLowerCase().indexOf(searchText) !== -1;
    if (categoryOk && searchOk) { result.push(a); }
  }
  return result;
}

// Put the current year in the footer
var yearBox = document.getElementById("year");
if (yearBox) { yearBox.innerHTML = new Date().getFullYear(); }

// ---------- 3. HOME PAGE: show all articles + search ----------
var homeGrid = document.getElementById("homeGrid");
if (homeGrid) {
  var homeSearch = document.getElementById("homeSearch");
  showCards(filterArticles("All", ""), "homeGrid");
  homeSearch.addEventListener("input", function () {
    showCards(filterArticles("All", homeSearch.value), "homeGrid");
  });
}

// ---------- 4. CATEGORIES PAGE: tabs + search ----------
var catGrid = document.getElementById("catGrid");
if (catGrid) {
  var currentCategory = "All";
  var catSearch = document.getElementById("catSearch");
  var tabs = document.querySelectorAll(".tab");

  for (var t = 0; t < tabs.length; t++) {
    tabs[t].addEventListener("click", function () {
      // remove "active" from all tabs, then add it to the clicked one
      for (var j = 0; j < tabs.length; j++) { tabs[j].classList.remove("active"); }
      this.classList.add("active");
      currentCategory = this.getAttribute("data-cat");
      showCards(filterArticles(currentCategory, catSearch.value), "catGrid");
    });
  }
  catSearch.addEventListener("input", function () {
    showCards(filterArticles(currentCategory, catSearch.value), "catGrid");
  });
  showCards(filterArticles("All", ""), "catGrid");
}

// ---------- 5. ARTICLE PAGE: read, like and bookmark ----------
var articleBox = document.getElementById("articleBox");
if (articleBox) {
  // Read the id from the web address, e.g. article.html?id=3
  var params = new URLSearchParams(window.location.search);
  var id = Number(params.get("id"));
  var all = getAllArticles();
  var found = null;
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) { found = all[i]; }
  }

  if (found === null) {
    articleBox.innerHTML = "<h2>Article not found</h2><p>Go back to the <a href='index.html'><u>home page</u></a>.</p>";
  } else {
    var paragraphs = found.text.split("\n").join("</p><p>");
    articleBox.innerHTML =
      '<span class="tag">' + found.category + '</span>' +
      '<h1>' + clean(found.title) + '</h1>' +
      '<small>By ' + clean(found.author) + ' | ' + found.date + ' | ' + readingTime(found.text) + ' min read</small>' +
      '<div class="big ' + found.category.toLowerCase() + '">' + found.icon + '</div>' +
      '<p>' + clean(paragraphs).split("&lt;/p&gt;&lt;p&gt;").join("</p><p>") + '</p>' +
      '<div class="actions"><button class="btn" id="likeBtn"></button><button class="btn" id="saveBtn"></button></div>';

    var likeBtn = document.getElementById("likeBtn");
    var saveBtn = document.getElementById("saveBtn");

    // Update the text on the two buttons
    function updateButtons() {
      var liked = getList("likedIds").indexOf(found.id) !== -1;
      var saved = getList("savedIds").indexOf(found.id) !== -1;
      likeBtn.innerHTML = (liked ? "♥ Liked" : "♡ Like") + " (" + likeCount(found) + ")";
      saveBtn.innerHTML = saved ? "🔖 Saved" : "🔖 Save for later";
      likeBtn.className = liked ? "btn on" : "btn";
      saveBtn.className = saved ? "btn on" : "btn";
    }

    // Add the id if it is not in the list, remove it if it is
    function toggleInList(key) {
      var list = getList(key);
      var position = list.indexOf(found.id);
      if (position === -1) { list.push(found.id); } else { list.splice(position, 1); }
      saveList(key, list);
      updateButtons();
    }

    likeBtn.addEventListener("click", function () { toggleInList("likedIds"); });
    saveBtn.addEventListener("click", function () { toggleInList("savedIds"); });
    updateButtons();
  }
}

// ---------- 6. TRENDING PAGE: most liked + saved articles ----------
var trendBox = document.getElementById("trendBox");
if (trendBox) {
  var list = getAllArticles();
  // Sort so the article with the most likes comes first
  list.sort(function (a, b) { return likeCount(b) - likeCount(a); });

  var html = "";
  for (var k = 0; k < 5; k++) {
    html += '<div class="rank"><b>' + (k + 1) + '</b><div>' +
            '<a href="article.html?id=' + list[k].id + '"><h3>' + clean(list[k].title) + '</h3></a>' +
            '<small>' + list[k].category + ' | ♥ ' + likeCount(list[k]) + '</small></div></div>';
  }
  trendBox.innerHTML = html;

  // Saved articles
  var savedIds = getList("savedIds");
  var savedList = [];
  var everything = getAllArticles();
  for (var s = 0; s < everything.length; s++) {
    if (savedIds.indexOf(everything[s].id) !== -1) { savedList.push(everything[s]); }
  }
  if (savedList.length === 0) {
    document.getElementById("savedGrid").innerHTML = "<p>You have not saved any article yet. Open an article and press Save.</p>";
  } else {
    showCards(savedList, "savedGrid");
  }
}

// ---------- 7. WRITE A POST PAGE: validate and save ----------
var postForm = document.getElementById("postForm");
if (postForm) {
  postForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading
    var title = document.getElementById("title").value.trim();
    var author = document.getElementById("author").value.trim();
    var category = document.getElementById("category").value;
    var text = document.getElementById("text").value.trim();
    var msg = document.getElementById("msg");

    // Validation
    if (title.length < 5) { msg.className = "error"; msg.innerHTML = "Title must have at least 5 characters."; return; }
    if (author === "") { msg.className = "error"; msg.innerHTML = "Please enter your name."; return; }
    if (text.length < 50) { msg.className = "error"; msg.innerHTML = "Article must have at least 50 characters."; return; }

    // Create the new article object
    var today = new Date().toDateString();
    var newPost = {
      id: Date.now(),            // a unique number
      title: title, category: category, author: author,
      date: today, icon: "✍️", likes: 0, text: text
    };

    // Add it to the saved posts list
    var posts = getList("userPosts");
    posts.unshift(newPost);      // unshift = add at the start
    saveList("userPosts", posts);

    msg.className = "success";
    msg.innerHTML = "Post published! Taking you to the home page...";
    setTimeout(function () { window.location.href = "index.html"; }, 1200);
  });
}

// ---------- 8. CONTACT PAGE: validate ----------
var contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("cname").value.trim();
    var email = document.getElementById("cemail").value.trim();
    var message = document.getElementById("cmessage").value.trim();
    var msg = document.getElementById("cmsg");

    if (name === "") { msg.className = "error"; msg.innerHTML = "Please enter your name."; return; }
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) { msg.className = "error"; msg.innerHTML = "Please enter a valid email."; return; }
    if (message.length < 10) { msg.className = "error"; msg.innerHTML = "Message must have at least 10 characters."; return; }

    msg.className = "success";
    msg.innerHTML = "Thank you, " + clean(name) + "! We will reply soon.";
    contactForm.reset();
  });
}
