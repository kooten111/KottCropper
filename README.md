
# KottCropper

A simple tool for cropping images to a specific aspect ratio, useful for cropping large number of images, for example if you are training a LORA.

Birme.net lacks the ability to crop only specific parts of an image, so I made this tool to do that.

![Screenshot](readme/example_img.png)

  

## Usage
Install requirements

    pip install flask pillow

Download the repo

    git clone https://github.com/kooten111/KottCropper

Go to \images and put the images you want to crop there. 

Run the app
    
    python Cropper.py

Go to `localhost:5000` in your browser and start cropping.

Your cropped images will be in \cropped_images

## Credit
https://github.com/fengyuanchen/cropperjs I basically just used this library and made a simple flask app around it.
