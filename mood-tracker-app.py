import tkinter as tk
from tkinter import messagebox
import sqlite3
from datetime import date

# Create a SQLite database
conn = sqlite3.connect('mood_tracker.db')
c = conn.cursor()

# Create table
c.execute('''CREATE TABLE IF NOT EXISTS mood_entries
             (id INTEGER PRIMARY KEY, date TEXT, mood TEXT)''')
conn.commit()

# Function to add mood entry to the database
def add_entry():
    mood = mood_entry.get()
    if mood:
        today = date.today().strftime("%Y-%m-%d")
        c.execute("INSERT INTO mood_entries (date, mood) VALUES (?, ?)", (today, mood))
        conn.commit()
        messagebox.showinfo("Success", "Mood entry added successfully!")
        mood_entry.delete(0, tk.END)
    else:
        messagebox.showerror("Error", "Please enter your mood.")

# Function to display mood history
def display_history():
    history_window = tk.Toplevel(root)
    history_window.title("Mood History")
    scrollbar = tk.Scrollbar(history_window)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    history_listbox = tk.Listbox(history_window, yscrollcommand=scrollbar.set)
    history_listbox.pack(expand=True, fill=tk.BOTH)
    
    c.execute("SELECT * FROM mood_entries ORDER BY date DESC")
    entries = c.fetchall()
    for entry in entries:
        history_listbox.insert(tk.END, f"{entry[1]}: {entry[2]}")
    
    scrollbar.config(command=history_listbox.yview)

# Create the main GUI window
root = tk.Tk()
root.title("Mood Tracker")

# Add mood entry widgets
mood_label = tk.Label(root, text="Enter your mood:")
mood_label.pack()
mood_entry = tk.Entry(root, width=30)
mood_entry.pack()
add_button = tk.Button(root, text="Add Entry", command=add_entry)
add_button.pack()

# Display mood history button
history_button = tk.Button(root, text="View Mood History", command=display_history)
history_button.pack()

root.mainloop()
