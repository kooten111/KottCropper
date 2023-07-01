# Flask Code
from flask import Flask, request, render_template, jsonify
from PIL import Image
import os
import base64
import re
import io

app = Flask(__name__)
counter_dict = {}

@app.route('/', methods=['GET'])
def display_image():
    image_files = os.listdir('static/images')  # path to the directory with images
    return render_template('index.html', images=image_files)

@app.route('/crop', methods=['POST'])
def crop_image():
    data = request.json['imgData']
    filename = request.json['filename']
    image_data = re.sub('^data:image/.+;base64,', '', data)
    image_data = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_data))

    if not os.path.exists('static/cropped_images'):
        os.makedirs('static/cropped_images')

    counter = 0
    while True:
        new_filename = f"{filename.split('.')[0]}_{counter}.png"
        if not os.path.exists(f"static/cropped_images/{new_filename}"):
            break
        counter += 1

    image.save(f"static/cropped_images/{new_filename}", "PNG")

    return jsonify({'status': 'success', 'message': 'Image cropped and saved successfully.', 'new_filename': new_filename})

if __name__ == "__main__":
    app.run(debug=True)