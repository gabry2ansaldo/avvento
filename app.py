from flask import Flask, render_template
from datetime import date

today = date.today()
CURRENT_DAY = today.day if today.month == 12 else 0

app = Flask(__name__)

contents = {
    1: {"title": "1 Dicembre", "text": "", "image": "day1.png"},
    2: {"title": "2 Dicembre", "text": "", "image": "day2.png"},
    3: {"title": "3 Dicembre", "text": "", "image": "day3.png"},
    4: {"title": "4 Dicembre", "text": "", "image": "day4.png"},
    5: {"title": "5 Dicembre", "text": "", "image": "day5.png"},
    6: {"title": "6 Dicembre", "text": "", "image": "day6.png"},
    7: {"title": "7 Dicembre", "text": "", "image": "day7.png"},
    8: {"title": "8 Dicembre", "text": "", "image": "day8.png"},
    9: {"title": "9 Dicembre", "text": "", "image": "day9.png"},
    10: {"title": "10 Dicembre", "text": "", "image": "day10.png"},
    11: {"title": "11 Dicembre", "text": "", "image": "day11.png"},
    12: {"title": "12 Dicembre", "text": "", "image": "day12.png"},
    13: {"title": "13 Dicembre", "text": "", "image": "day13.png"},
    14: {"title": "14 Dicembre", "text": "", "image": "day14.png"},
    15: {"title": "15 Dicembre", "text": "", "image": "day15.png"},
    16: {"title": "16 Dicembre", "text": "", "image": "day16.png"},
    17: {"title": "17 Dicembre", "text": "", "image": "day17.png"},
    18: {"title": "18 Dicembre", "text": "", "image": "day18.png"},
    19: {"title": "19 Dicembre", "text": "", "image": "day19.png"},
    20: {"title": "20 Dicembre", "text": "", "image": "day20.png"},
    21: {"title": "21 Dicembre", "text": "", "image": "day21.png"},
    22: {"title": "22 Dicembre", "text": "", "image": "day22.png"},
    23: {"title": "23 Dicembre", "text": "", "image": "day23.png"},
    24: {"title": "24 Dicembre", "text": "", "image": "day24.png"}
}

@app.route("/")
def home():
    return render_template("index.html", contents=contents,
        current_day=CURRENT_DAY)

if __name__ == "__main__":
    app.run(debug=True)
