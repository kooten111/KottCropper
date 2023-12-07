# Flask Code
from flask import Flask, request, render_template, jsonify, send_from_directory
import urllib.parse
from PIL import Image
import os
import base64
import re
import io

app = Flask(__name__)
image_directory = 'images'
cropped_image_directory = 'cropped_images'
image_files_directory = os.path.join(os.getcwd(), 'images')
cropped_image_files_directory = os.path.join(os.getcwd(), 'cropped_images')

if not os.path.exists(image_files_directory):
    os.makedirs(image_files_directory)

if not os.path.exists(cropped_image_files_directory):
    os.makedirs(cropped_image_files_directory)

def url_friendly(filename):
    filename = urllib.parse.quote_plus(filename)
    return filename

@app.route('/', methods=['GET'])
def display_image():
    image_files = os.listdir(image_files_directory)
    if len(image_files) == 0:
        return render_template('index.html', images=None)
    else:
        return render_template('index.html', images=image_files)
    
@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(image_files_directory, filename)

@app.route('/cropped_images/<filename>')
def serve_cropped_image(filename):
    return send_from_directory(cropped_image_files_directory, filename)

@app.route('/crop', methods=['POST'])
def crop_image():
    data = request.json['imgData']
    filename = request.json['filename']
    image_data = re.sub('^data:image/.+;base64,', '', data)
    image_data = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_data))

    counter = 0
    while True:
        new_filename = f"{filename.split('.')[0]}_{counter}.png"
        new_filepath = os.path.join(cropped_image_files_directory, new_filename)
        if not os.path.exists(new_filepath):
            break
        counter += 1

    image.save(new_filepath, "PNG")
    safe_filename = url_friendly(new_filename)
    return jsonify({'status': 'success', 'message': 'Image cropped and saved successfully.', 'new_filename': safe_filename})

if __name__ == "__main__":
    app.run(debug=True)