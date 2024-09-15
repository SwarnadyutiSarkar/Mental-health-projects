import cv2
import tkinter as tk
from tkinter import Label, Button, Frame
from PIL import Image, ImageTk
from deepface import DeepFace

class EmotionRecognitionApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Emotion Recognition")

        self.video_source = 0
        self.vid = cv2.VideoCapture(self.video_source)

        self.canvas = Canvas(root, width=self.vid.get(cv2.CAP_PROP_FRAME_WIDTH), height=self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
        self.canvas.pack()

        self.button_frame = Frame(root)
        self.button_frame.pack()

        self.btn_capture = Button(self.button_frame, text="Capture", width=10, command=self.capture_image)
        self.btn_capture.pack(side="left")

        self.lbl_emotion = Label(root, text="Emotion will be displayed here", font=("Helvetica", 16))
        self.lbl_emotion.pack()

        self.update()

    def update(self):
        ret, frame = self.vid.read()
        if ret:
            self.photo = ImageTk.PhotoImage(image=Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
            self.canvas.create_image(0, 0, image=self.photo, anchor=tk.NW)
        self.root.after(10, self.update)

    def capture_image(self):
        ret, frame = self.vid.read()
        if ret:
            image_path = 'captured_image.jpg'
            cv2.imwrite(image_path, frame)
            self.recognize_emotion(image_path)

    def recognize_emotion(self, image_path):
        try:
            analysis = DeepFace.analyze(img_path=image_path, actions=['emotion'])
            emotion = analysis[0]['dominant_emotion']
            self.lbl_emotion.config(text=f"Detected Emotion: {emotion}")
        except Exception as e:
            self.lbl_emotion.config(text=f"Error: {str(e)}")

    def __del__(self):
        if self.vid.isOpened():
            self.vid.release()

if __name__ == "__main__":
    root = tk.Tk()
    app = EmotionRecognitionApp(root)
    root.mainloop()
