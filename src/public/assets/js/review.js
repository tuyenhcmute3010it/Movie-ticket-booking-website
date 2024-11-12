function toggleLike(button) {
  const likeCountSpan = button.querySelector(".like-count");
  let likeCount = parseInt(likeCountSpan.textContent);
  button.classList.toggle("liked");

  if (button.classList.contains("liked")) {
    likeCount++;
    button.style.color = "blue"; // Change icon color to blue
  } else {
    likeCount--;
    button.style.color = ""; // Reset icon color
  }

  likeCountSpan.textContent = likeCount;
}

// Function to show/hide the comment box
function toggleCommentBox(button) {
  const commentBox = button.parentNode.nextElementSibling;
  if (commentBox.style.display === "none") {
    commentBox.style.display = "block";
  } else {
    commentBox.style.display = "none";
  }
}

function submitNewComment(button) {
  const inputBox = button.previousElementSibling;
  const commentText = inputBox.value.trim();
  const commentsContainer = button.parentNode.querySelector(
    ".comments-container"
  );
  const commentCountSpan =
    button.parentNode.parentNode.parentNode.querySelector(".comment-count");

  if (commentText !== "" || uploadedImage) {
    const newComment = document.createElement("div");
    newComment.classList.add("comment-item");

    newComment.innerHTML = `
          <img src="./assets/img/avatar/default-avatar.jpg" alt="User Avatar" class="comment-avatar" />
          <div class="comment-content">
            <span class="comment-author">You</span>
            <div class="comment-text">${commentText}</div>
            <img src="${uploadedImage}" class="uploaded-image" alt="Uploaded Image" />
          </div>
        `;

    commentsContainer.appendChild(newComment);

    // Clear the input box and reset uploaded image after submission
    inputBox.value = "";
    uploadedImage = "";
    previewContainer.innerHTML = ""; // Clear the preview
    previewContainer.style.display = "none"; // Hide the preview

    const commentCount =
      commentsContainer.querySelectorAll(".comment-item").length;
    commentCountSpan.textContent = commentCount;
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
  }
}
// Initialize comment count based on pre-existing comments
document.addEventListener("DOMContentLoaded", function () {
  const commentCounts = document.querySelectorAll(".comment-count");
  const commentLists = document.querySelectorAll(".comments-container");

  commentCounts.forEach((countSpan, index) => {
    countSpan.textContent =
      commentLists[index].querySelectorAll(".comment-item").length;
  });
});
//// upload img
let uploadedImage = "";

function handleImageUpload(input) {
  const file = input.files[0];
  const previewContainer = input.parentNode.querySelector(
    ".image-preview-container"
  );

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImage = e.target.result; // Save the image data URL
      // Set the uploaded image as the preview
      previewContainer.innerHTML = `<img src="${uploadedImage}" class="uploaded-image" alt="Uploaded Image Preview" />`;
      previewContainer.style.display = "block"; // Show the preview
    };
    reader.readAsDataURL(file);
  }
}

function submitNewComment(button) {
  const inputBox = button.previousElementSibling;
  const commentText = inputBox.value.trim();
  const commentsContainer = button.parentNode.querySelector(
    ".comments-container"
  );
  const commentCountSpan =
    button.parentNode.parentNode.parentNode.querySelector(".comment-count");
  const previewContainer = button.parentNode.querySelector(
    ".image-preview-container"
  );

  if (commentText !== "" || uploadedImage) {
    // Create a new comment element
    const newComment = document.createElement("div");
    newComment.classList.add("comment-item");

    newComment.innerHTML = `
          <img src="./assets/img/avatar/default-avatar.jpg" alt="User Avatar" class="comment-avatar" />
          <div class="comment-content">
            <span class="comment-author">You</span>
            <div class="comment-text">${commentText}</div>
            ${
              uploadedImage
                ? `<img src="${uploadedImage}" class="uploaded-image" alt="Uploaded Image" />`
                : ""
            }
          </div>
        `;

    // Append the new comment to the container
    commentsContainer.appendChild(newComment);

    // Clear the input box and reset uploaded image after submission
    inputBox.value = "";
    uploadedImage = "";
    previewContainer.innerHTML = ""; // Clear the preview
    previewContainer.style.display = "none"; // Hide the preview

    // Update comment count
    const commentCount =
      commentsContainer.querySelectorAll(".comment-item").length;
    commentCountSpan.textContent = commentCount;

    // Scroll to the bottom to show the latest comment
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
  }
}

function toggleIconList(button) {
  const reviewCard = button.closest(".review-card");
  const iconList = reviewCard.querySelector(".icon-list");
  iconList.style.display = iconList.style.display === "none" ? "block" : "none";
}

// Function to add the selected emoji to the comment input of the specific review card
function addIconToComment(icon, button) {
  const reviewCard = button.closest(".review-card");
  const inputBox = reviewCard.querySelector(".comment-input");
  inputBox.value += icon; // Append the selected icon to the comment

  // Hide the emoji list after selection
  const iconList = reviewCard.querySelector(".icon-list");
  iconList.style.display = "none";
}

// Function to handle image upload and display the preview in the specific review card
function handleImageUpload(input) {
  const file = input.files[0];
  const reviewCard = input.closest(".review-card");
  const previewContainer = reviewCard.querySelector(".image-preview-container");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const uploadedImage = e.target.result; // Save the image data URL
      // Set the uploaded image as the preview
      previewContainer.innerHTML = `<img src="${uploadedImage}" class="uploaded-image" alt="Uploaded Image Preview" />`;
      previewContainer.style.display = "block"; // Show the preview
    };
    reader.readAsDataURL(file);
  }
}

function submitNewComment(button) {
  const reviewCard = button.closest(".review-card");
  const commentInput = reviewCard.querySelector(".comment-input");
  const commentText = commentInput.value.trim();
  const previewContainer = reviewCard.querySelector(".image-preview-container");
  const uploadedImage = previewContainer.innerHTML;
  const commentCountSpan = reviewCard.querySelector(".comment-count");

  if (commentText || uploadedImage) {
    const commentsContainer = reviewCard.querySelector(".comments-container");

    // Create a new comment item
    const newComment = document.createElement("div");
    newComment.classList.add("comment-item");

    // Construct comment content
    newComment.innerHTML = `
      <img src="./assets/img/avatar/default-avatar.jpg" alt="User Avatar" class="comment-avatar" />
      <div class="comment-content">
        <span class="comment-author">You</span>
        <div class="comment-text">${commentText}</div>
        ${
          uploadedImage
            ? `<div class="comment-image">${uploadedImage}</div>`
            : ""
        }
      </div>
    `;

    // Append the new comment to the comments container
    commentsContainer.appendChild(newComment);

    // Clear input fields after submitting
    commentInput.value = "";
    previewContainer.innerHTML = "";
    previewContainer.style.display = "none";

    // Update comment count
    const commentCount =
      commentsContainer.querySelectorAll(".comment-item").length;
    commentCountSpan.textContent = commentCount;

    // Scroll to the bottom to show the latest comment
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
  } else {
    alert("Please enter a comment or upload an image before submitting.");
  }
}
