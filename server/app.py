import cv2
import mediapipe as mp
import serial
import time
import base64
import numpy as np
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# MediaPipe setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Initialize hands detector (real-time tracking mode)
hands_detector = mp_hands.Hands(
    static_image_mode=False,  # ✅ Real-time tracking
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

# Global variables
serial_connection = None
last_finger_count = None
serial_lock = threading.Lock()

def connect_to_arduino():
    global serial_connection
    try:
        serial_connection = serial.Serial('COM7', 9600, timeout=1)
        time.sleep(2)
        print("✅ Connected to Arduino on COM7")
        return True
    except Exception as e:
        print(f"❌ Error connecting to Arduino: {e}")
        return False

def send_to_arduino(finger_count):
    global serial_connection
    if not serial_connection:
        if not connect_to_arduino():
            return False
    try:
        with serial_lock:
            command = str(finger_count)
            serial_connection.write(command.encode())
            print(f"📤 Sent to Arduino: {command}")
        return True
    except Exception as e:
        print(f"❌ Failed to send to Arduino: {e}")
        serial_connection = None
        return False

def count_fingers(landmarks, handedness):
    fingers = []

    # Thumb
    if handedness == "Right":
        fingers.append(int(landmarks[4].x > landmarks[3].x))
    else:
        fingers.append(int(landmarks[4].x < landmarks[3].x))

    # Other fingers
    fingers.append(int(landmarks[8].y < landmarks[6].y))   # Index
    fingers.append(int(landmarks[12].y < landmarks[10].y)) # Middle
    fingers.append(int(landmarks[16].y < landmarks[14].y)) # Ring
    fingers.append(int(landmarks[20].y < landmarks[18].y)) # Pinky

    return sum(fingers)

@socketio.on('connect')
def handle_connect():
    print('🌐 Client connected')
    if not serial_connection:
        connect_to_arduino()

@socketio.on('disconnect')
def handle_disconnect():
    print('🔌 Client disconnected')

@socketio.on('process_frame')
def process_frame(data):
    global last_finger_count
    try:
        # Decode image
        image_data = base64.b64decode(data['image'].split(',')[1])
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Resize and adjust brightness (optional)
        img = cv2.resize(img, (640, 480))
        img = cv2.convertScaleAbs(img, alpha=1.2, beta=30)

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands_detector.process(img_rgb)

        if results.multi_hand_landmarks and results.multi_handedness:
            hand_landmarks = results.multi_hand_landmarks[0]
            handedness = results.multi_handedness[0].classification[0].label

            finger_count = count_fingers(hand_landmarks.landmark, handedness)

            # Send to Arduino only if count has changed
            if finger_count != last_finger_count:
                last_finger_count = finger_count
                send_to_arduino(finger_count)

            # Prepare landmarks to emit
            landmarks_to_send = [
                {'x': lm.x, 'y': lm.y, 'z': lm.z}
                for lm in hand_landmarks.landmark
            ]

            emit('finger_count', {
                'count': finger_count,
                'hand_landmarks': landmarks_to_send
            })
        else:
            emit('finger_count', {
                'count': None,
                'hand_landmarks': []
            })

    except Exception as e:
        print(f"❗ Error processing frame: {e}")
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
