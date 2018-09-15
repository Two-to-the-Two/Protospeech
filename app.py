from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('home.html')

@app.route('/navbar')
def navbar():
    return render_template('navbar.html')

@app.route('/body')
def body():
    return render_template('body.html')

@app.route('/footer')
def footer():
    return render_template('footer.html')
