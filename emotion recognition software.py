import cv2
import numpy as np
from tensorflow.keras.models import load_model

# Load pre-trained deep learning model for emotion recognition
model = load_model('emotion_detection_model.h5')

# Define emotions
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

# Function to detect and recognize emotions from video frames
def detect_emotions():
    # Load face cascade classifier
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Start video capture
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        # Convert frame to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            # Extract face region
            face_roi = gray[y:y + h, x:x + w]
            face_roi = cv2.resize(face_roi, (48, 48))

            # Normalize pixel values
            face_roi = face_roi / 255.0

            # Reshape image for model input
            face_roi = np.reshape(face_roi, (1, 48, 48, 1))

            # Predict emotion
            predicted_emotion = EMOTIONS[np.argmax(model.predict(face_roi))]
            cv2.putText(frame, predicted_emotion, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Draw rectangle around face
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        # Display frame
        cv2.imshow('Emotion Recognition', frame)

        # Exit loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release video capture and close all windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    detect_emotions()
