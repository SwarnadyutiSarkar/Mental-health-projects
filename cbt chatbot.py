import nltk
import random
import re

# Uncomment the following two lines if you haven't downloaded NLTK data before
# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')

# Define patterns and responses
patterns = {
    'greeting': ['hello', 'hi', 'hey', 'howdy'],
    'farewell': ['bye', 'goodbye', 'see you'],
    'thanks': ['thank you', 'thanks', 'thanks a lot'],
    'problem': ['I feel anxious', 'I feel depressed', 'I am stressed', 'I have panic attacks'],
    'solution': ['Try to take deep breaths.', 'Focus on things you can control.', 
                 'Challenge negative thoughts.', 'Practice relaxation techniques.']
}

responses = {
    'greeting': ['Hello!', 'Hi there!', 'Hey, how can I help you?'],
    'farewell': ['Goodbye!', 'Have a great day!', 'See you later.'],
    'thanks': ['You\'re welcome!', 'Glad I could help.', 'No problem!'],
    'problem': ['I\'m sorry to hear that.', 'That sounds tough.', 'It\'s okay, I\'m here to listen.'],
    'solution': ['Here are some strategies that might help:', 'Try these coping techniques:', 
                 'You can use these methods to manage your feelings:']
}

# Function to process user input and generate bot response
def chatbot_response(user_input):
    for pattern_key, pattern_list in patterns.items():
        for pattern in pattern_list:
            if re.search(pattern, user_input, re.IGNORECASE):
                response_key = pattern_key
                break
        else:
            continue
        break
    
    if response_key == 'problem':
        return random.choice(responses[response_key]) + ' ' + random.choice(responses['solution'])
    elif response_key in responses:
        return random.choice(responses[response_key])
    else:
        return "I'm not sure how to respond to that."

# Main loop to interact with the chatbot
print("CBT Chatbot: Hello! How can I help you today? (Type 'bye' to exit)")
while True:
    user_input = input("You: ")
    if user_input.lower() == 'bye':
        print("CBT Chatbot:", random.choice(responses['farewell']))
        break
    else:
        print("CBT Chatbot:", chatbot_response(user_input))
