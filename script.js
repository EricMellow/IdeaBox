getFromStorage();

var $inputTitle = $('.form__input-title');
var $inputBody = $('.form__input-body');
var $saveBtn = $('.form__button-save')
var $quality = 'quality: swill';

$saveBtn.on('click', saveIdea);
$inputBody.on('keyup', toggleDisableState);
$inputTitle.on('keyup', toggleDisableState);
$('.section__ideas').on('click', '.delete-x', deleteIdeas);
$('.section__ideas').on('click', '.upvote', upvoteIdea);
$('.section__ideas').on('click', '.downvote', downvoteIdea);
$('.section__ideas').on('keyup', '.idea-title', persistChanges);
$('.section__ideas').on('keyup', '.idea-body', persistChanges);
$('.section__search-field').on('keyup', searchIdeas);

function saveIdea(event) {
  event.preventDefault();
  var newIdea = new ConstructIdeas((jQuery.now()), $inputTitle.val(), $inputBody.val(), $quality)
  sendToStorage(newIdea);
  $('.section__ideas').prepend(`<article class="idea-cards" id="${newIdea.id}">
    <h2 class="idea-title" contenteditable="true">${newIdea.title}</h2>
    <article class="delete-x"></article>
    <p class="idea-body" contenteditable="true">${newIdea.body}</p>
    <article class="upvote"></article>
    <article class="downvote"></article>
    <h3 class="quality">${newIdea.quality}</h3>
    </article>`);
  clearInputs();
  toggleDisableState();
}

function ConstructIdeas(id, title, body, quality) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = quality;
}

function sendToStorage(idea) {
  var stringifiedIdea = JSON.stringify(idea);
  localStorage.setItem(idea.id, stringifiedIdea)
}

function getFromStorage() {
  var values = [];
  var keys = Object.keys(localStorage);
  for (var i = 0; i < keys.length; i++) {
    values.push(JSON.parse(localStorage.getItem(keys[i])));
    $('.section__ideas').prepend(`<article class="idea-cards" id="${values[i].id}">
      <h2 class="idea-title" contenteditable="true">${values[i].title}</h2>
      <article class="delete-x" aria-label="Button to delete idea"></article>
      <p class="idea-body" contenteditable="true">${values[i].body}</p>
      <article class="upvote"></article>
      <article class="downvote"></article>
      <h3 class="quality">${values[i].quality}</h3>
      </article>`);
  }
}

function clearInputs() {
  $inputTitle.val('');
  $inputBody.val('');
  $inputTitle.focus();
}

function toggleDisableState() {
  if ($inputBody.val() && $inputTitle.val()) {
    $saveBtn.prop('disabled', false);
  } else {
    $saveBtn.prop('disabled', true);
  }
}

function deleteIdeas() {
  $(this).closest('.idea-cards').fadeOut();
  var id = $(this).closest('.idea-cards').attr('id');
  localStorage.removeItem(id);
}

function changeStorageQuality(newthis) {
  var id = $(newthis).closest('.idea-cards').attr('id');
  var idea = localStorage.getItem(id);
  idea = JSON.parse(idea);
  idea.quality = $(newthis).siblings('h3').text();
  var stringifiedIdea = JSON.stringify(idea)
  localStorage.setItem(id, stringifiedIdea);
}

function upvoteIdea() {
  if ($(this).siblings('h3').text() === 'quality: swill') {
    $(this).siblings('h3').text('quality: plausible');
  } else if ($(this).siblings('h3').text() === 'quality: plausible') {
    $(this).siblings('h3').text('quality: genius');
  }
  changeStorageQuality(this)
}

function downvoteIdea() {
  if ($(this).siblings('h3').text() === 'quality: genius') {
    $(this).siblings('h3').text('quality: plausible')
  } else if ($(this).siblings('h3').text() === 'quality: plausible') {
    $(this).siblings('h3').text('quality: swill')
  }
  changeStorageQuality(this)
}

function persistChanges(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    $inputTitle.focus();
  }
  var id = $(this).closest('.idea-cards').attr('id');
  var idea = localStorage.getItem(id);
  idea = JSON.parse(idea);
  idea.title = $('.idea-title').text();
  idea.body = $('.idea-body').text();
  var stringifiedIdea = JSON.stringify(idea)
  
  localStorage.setItem(id, stringifiedIdea);
}

function searchIdeas() {
   $('.idea-cards').hide();
  search('.quality');
  search('.idea-body');
  search('.idea-title');
}

function search(selector) {
  var $input = $('.section__search-field').val();
  $input = $input.toUpperCase();
  var array = $(selector);
  for (var i = 0; i < array.length; i++) {
    if ($(array[i]).text().toUpperCase().includes($input)) {
      $(array[i]).closest('article').show();
    }
  }
}

