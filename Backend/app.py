import os
from flask_cors import CORS
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_huggingface import HuggingFaceEndpoint
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from googletrans import Translator  # Google Translate library

# Load environment variables from .env file
load_dotenv()

api_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

# Define the repository ID and task
repo_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"
task = "text-generation"

app = Flask(__name__)
CORS(app)

template = """
You are a travel assistant chatbot named Yatra Sahayak designed to help users plan their trips and provide travel-related information. Here are some scenarios you should be able to handle:

1. Booking Flights: Assist users with booking flights to their desired destinations. Ask for departure city, destination city, travel dates, and any specific preferences (e.g., direct flights, airline preferences). Check available airlines and book the tickets accordingly.

2. Booking Hotels: Help users find and book accommodations. Inquire about city or region, check-in/check-out dates, number of guests, and accommodation preferences (e.g., budget, amenities). 

3. Booking Rental Cars: Facilitate the booking of rental cars for travel convenience. Gather details such as pickup/drop-off locations, dates, car preferences (e.g., size, type), and any additional requirements.

4. Destination Information: Provide information about popular travel destinations. Offer insights on attractions, local cuisine, cultural highlights, weather conditions, and best times to visit.

5. Travel Tips: Offer practical travel tips and advice. Topics may include packing essentials, visa requirements, currency exchange, local customs, and safety tips.

6. Weather Updates: Give current weather updates for specific destinations or regions. Include temperature forecasts, precipitation chances, and any weather advisories.

7. Local Attractions: Suggest local attractions and points of interest based on the user's destination. Highlight must-see landmarks, museums, parks, and recreational activities.

8. Customer Service: Address customer service inquiries and provide assistance with travel-related issues. Handle queries about bookings, cancellations, refunds, and general support.

Please ensure responses are informative, accurate, and tailored to the user's queries and preferences. Use natural language to engage users and provide a seamless experience throughout their travel planning journey.

Chat history:
{chat_history}

User question:
{user_question}
"""

prompt = ChatPromptTemplate.from_template(template)

# Function to get a response from the model
def get_response(user_query, chat_history, language):
    llm = HuggingFaceEndpoint(
        huggingfacehub_api_token=api_token,
        repo_id=repo_id,
        task=task
    )

    chain = prompt | llm | StrOutputParser()

    response = chain.invoke({
        "chat_history": chat_history,
        "user_question": user_query,
    })

    # Translate response to the requested language if needed
    if language != 'en':
        response = translate_to_language(response, language)

    # Filter out labels or prefixes
    formatted_response = filter_labels(response.strip())
    
    return formatted_response

def translate_to_language(text, language):
    translator = Translator()
    translated = translator.translate(text, dest=language)
    return translated.text

def filter_labels(response):
    # List of labels to remove
    labels_to_remove = [
        "AI response:", "Yatra Sahayak Response:", "Assistance:", "AI:", "Ai", "AI Assistance:", 
        " [AIMessage(content = ", "Yatra Sahayak", " HumanMessage(content = 'Thank you')", "yatrasahayak", "Yatrasahayak", "response:",
        "Assessment:", "Response rating:"
    ]

    # Remove any labels or prefixes
    for label in labels_to_remove:
        if response.startswith(label):
            response = response[len(label):].strip()
    
    return response

# Initialize chat history
chat_history = [
    AIMessage(content="Hello, I am Yatra Sahayak. How can I help you?"),
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    global chat_history
    data = request.json
    user_query = data['user_query']
    language = data.get('language', 'en')  # Default to English if not specified
    chat_history.append(HumanMessage(content=user_query))
    
    response = get_response(user_query, chat_history, language)
    
    chat_history.append(AIMessage(content=response))
    
    return jsonify({
        'user_query': user_query,
        'response': response,
        'chat_history': [(msg.__class__.__name__, msg.content) for msg in chat_history]
    })

if __name__ == '__main__':
    app.run(debug=True)
