$(document).ready(function() {
  var images = Array.from(document.querySelectorAll('.image-crop'));
  var currentImageIndex = 0;
  var cropper = null;
  var currentAspectRatio = $("#aspectRatio").val();

  function getFileName(path) {
    return path.split('/').pop();
  }

  function initCropper(img, aspectRatio) {
    return new Cropper(img, {
      aspectRatio: aspectRatio,
    });
  }

  images.forEach(img => img.style.display = 'none');
  images[0].style.display = 'block';
  cropper = initCropper(images[0], $("#aspectRatio").val());
  cropper.setAspectRatio(1);
  
  $("#aspectRatio").change(function(){
      currentAspectRatio = $("#aspectRatio").val();
      cropper.destroy();
      cropper = initCropper(images[currentImageIndex], currentAspectRatio);
  });

  $("#customRatioWidth, #customRatioHeight").on("input", function() {
    var customRatioWidth = $("#customRatioWidth").val();
    var customRatioHeight = $("#customRatioHeight").val();

    if(customRatioWidth > 0 && customRatioHeight > 0) {
      currentAspectRatio = customRatioWidth / customRatioHeight;
      cropper.destroy();
      cropper = initCropper(images[currentImageIndex], currentAspectRatio);
    } else {
      alert("Please enter valid values for width and height");
    }
  });

  $("#prev").click(function(){
    cropper.clear();
    cropper.destroy();
    images[currentImageIndex].style.display = 'none';
    currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : images.length - 1;
    images[currentImageIndex].style.display = 'block';
    cropper = initCropper(images[currentImageIndex], currentAspectRatio);
  });

  $("#next").click(function(){
    cropper.clear();
    cropper.destroy();
    images[currentImageIndex].style.display = 'none';
    currentImageIndex = (currentImageIndex < images.length - 1) ? currentImageIndex + 1 : 0;
    images[currentImageIndex].style.display = 'block';
    cropper = initCropper(images[currentImageIndex], currentAspectRatio);
  });

  $("#crop").click(function(){
    var imgsrc = cropper.getCroppedCanvas().toDataURL();
    $.ajax({
      url: "/crop",
      type: 'POST',
      data: JSON.stringify({imgData: imgsrc, filename: getFileName(images[currentImageIndex].src)}),
      contentType: 'application/json;charset=UTF-8',
      success: function(data) {
          var img = $('<img>'); 
          img.attr('src', 'static/cropped_images/' + data.new_filename);
          img.prependTo('#lastCrops');
          var cropList = $('#lastCrops');
          if (cropList.children('img').length > 5) {
            cropList.children('img').last().remove();
          }
      }
    });
  });

  function widenAspectRatio() {
    var customRatioWidth = $("#customRatioWidth").val();
    var customRatioHeight = $("#customRatioHeight").val();
    // If current aspect ratio is tall, convert it to wide
    if (customRatioWidth < customRatioHeight) { 
        $("#customRatioWidth").val(customRatioHeight);
        $("#customRatioHeight").val(customRatioWidth);
    }
    currentAspectRatio = $("#customRatioWidth").val() / $("#customRatioHeight").val();
    cropper.destroy();
    cropper = initCropper(images[currentImageIndex], currentAspectRatio);
  }

  function tallAspectRatio() {
    var customRatioWidth = $("#customRatioWidth").val();
    var customRatioHeight = $("#customRatioHeight").val();
    // If current aspect ratio is wide, convert it to tall
    if (customRatioWidth > customRatioHeight) { 
        $("#customRatioWidth").val(customRatioHeight);
        $("#customRatioHeight").val(customRatioWidth);
    }
    currentAspectRatio = $("#customRatioWidth").val() / $("#customRatioHeight").val();
    cropper.destroy();
    cropper = initCropper(images[currentImageIndex], currentAspectRatio);
  }

  document.addEventListener('keydown', function(event) {
    var key = event.key || event.keyCode;
    switch (key) {
      case 'ArrowRight':
        event.preventDefault();
        $('#next').click();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        $('#prev').click();
        break;
      case 'ArrowDown':
        event.preventDefault();
        tallAspectRatio();
        break;
      case 'ArrowUp':
        event.preventDefault();
        widenAspectRatio();
        break;
      case 'Enter':
        event.preventDefault();
        $('#crop').click();
        break;
      default:
        break;
    }
  });
});
