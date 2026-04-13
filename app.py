"""
Sanjeevini Convent School - Admission Form Application
Flask backend with SQLite database + simple auth
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import sqlite3
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'sanjeevini-school-secret-2024'
DB_PATH = os.path.join(os.path.dirname(__file__), 'admissions.db')

# Simple credentials (in production use hashed passwords)
USERS = {
    'admin': {'password': 'admin123', 'role': 'admin', 'name': 'Administrator'},
    'office': {'password': 'office123', 'role': 'staff', 'name': 'Office Staff'},
    'principal': {'password': 'principal123', 'role': 'admin', 'name': 'Principal'},
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS admissions (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id      TEXT UNIQUE NOT NULL,
            created_at      TEXT NOT NULL,
            updated_at      TEXT NOT NULL,
            form_data       TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def generate_student_id():
    conn = get_db()
    row = conn.execute('SELECT COUNT(*) as cnt FROM admissions').fetchone()
    count = row['cnt'] + 1
    conn.close()
    year = datetime.now().year
    return f"SCS-{year}-{count:04d}"

def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated

# ── AUTH ROUTES ──────────────────────────────────────

@app.route('/login', methods=['GET'])
def login_page():
    if 'user' in session:
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    user = USERS.get(username)
    if user and user['password'] == password:
        session['user'] = username
        session['role'] = user['role']
        session['name'] = user['name']
        return jsonify({'success': True, 'name': user['name'], 'role': user['role']})
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({'success': True})

@app.route('/api/me')
def api_me():
    if 'user' not in session:
        return jsonify({'logged_in': False}), 401
    return jsonify({'logged_in': True, 'name': session['name'], 'role': session['role'], 'username': session['user']})

# ── PAGE ROUTES ──────────────────────────────────────

@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/records')
@login_required
def records():
    return render_template('records.html')

@app.route('/print/<student_id>')
@login_required
def print_form(student_id):
    conn = get_db()
    row = conn.execute('SELECT form_data FROM admissions WHERE student_id=?', (student_id,)).fetchone()
    conn.close()
    if not row:
        return "Record not found", 404
    fd = json.loads(row['form_data'])
    return render_template('print_form.html', data=fd)

# ── API ROUTES ───────────────────────────────────────

@app.route('/api/save', methods=['POST'])
@login_required
def save_form():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data received'}), 400
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    existing_id = data.get('student_id', '').strip()
    conn = get_db()
    try:
        if existing_id:
            conn.execute('UPDATE admissions SET form_data=?, updated_at=? WHERE student_id=?',
                         (json.dumps(data), now, existing_id))
            conn.commit()
            return jsonify({'success': True, 'student_id': existing_id, 'action': 'updated'})
        else:
            student_id = generate_student_id()
            data['student_id'] = student_id
            conn.execute('INSERT INTO admissions (student_id, created_at, updated_at, form_data) VALUES (?,?,?,?)',
                         (student_id, now, now, json.dumps(data)))
            conn.commit()
            return jsonify({'success': True, 'student_id': student_id, 'action': 'saved'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/records', methods=['GET'])
@login_required
def get_records():
    search = request.args.get('q', '').strip().lower()
    conn = get_db()
    rows = conn.execute('SELECT student_id, form_data, created_at FROM admissions ORDER BY id DESC').fetchall()
    conn.close()
    results = []
    for row in rows:
        fd = json.loads(row['form_data'])
        name = fd.get('pupil_name', '').strip()
        sid = row['student_id']
        if search and search not in name.lower() and search not in sid.lower():
            continue
        results.append({
            'student_id': sid, 'name': name, 'created_at': row['created_at'],
            'sex': fd.get('sex', ''), 'dob_day': fd.get('dob_day', ''),
            'dob_month': fd.get('dob_month', ''), 'dob_year': fd.get('dob_year', ''),
            'admission_class': fd.get('admission_class', ''),
        })
    return jsonify(results)

@app.route('/api/record/<student_id>', methods=['GET'])
@login_required
def get_record(student_id):
    conn = get_db()
    row = conn.execute('SELECT form_data FROM admissions WHERE student_id=?', (student_id,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'Record not found'}), 404
    return jsonify(json.loads(row['form_data']))

@app.route('/api/record/<student_id>', methods=['DELETE'])
@login_required
def delete_record(student_id):
    if session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    conn = get_db()
    conn.execute('DELETE FROM admissions WHERE student_id=?', (student_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

if __name__ == '__main__':
    init_db()
    print("🏫 Starting Sanjeevini Convent School Admission System...")
    print("🌐 Open http://localhost:5000 in your browser")
    app.run(debug=True, port=5000)
