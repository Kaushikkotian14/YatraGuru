import os
import http.client
import json
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_community.llms import HuggingFaceEndpoint
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from googletrans import Translator  # Google Translate library

# Load environment variables from .env file
load_dotenv()

api_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

# TripAdvisor API details
API_HOST = "tripadvisor16.p.rapidapi.com"
API_KEY = "773715eac9msh2c5cbc94df31861p1298aajsn73344f859870"
HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
}

app = Flask(__name__)
CORS(app)

def make_api_request(endpoint, params=None):
    conn = http.client.HTTPSConnection(API_HOST)
    url = f"{endpoint}"
    if params:
        url += f"?{params}"
    conn.request("GET", url, headers=HEADERS)
    res = conn.getresponse()
    data = res.read()
    return data.decode("utf-8")  # Return as string for parsing later

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_geoid', methods=['GET'])
def get_geoid():
    location = request.args.get('location')
    if not location:
        return jsonify({"error": "Location parameter is required"}), 400
    
    response = make_api_request("/api/v1/hotels/searchLocation", f"query={location}")
    try:
        response_data = json.loads(response)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode API response"}), 500
    
    return jsonify(response_data)

@app.route('/hotel_search', methods=['POST'])
def hotel_search():
    data = request.json
    location = data.get("location")
    checkin = data.get("checkin")
    checkout = data.get("checkout")
    guests = data.get("guests", 1)
    page_number = data.get("pageNumber", 1)
    sort = data.get("sort", "popularity")
    
    if not location or not checkin or not checkout:
        return jsonify({"error": "Location, checkin, and checkout are required"}), 400
    
    geoid_response = make_api_request("/api/v1/hotels/searchLocation", f"query={location}")
    try:
        geoid_data = json.loads(geoid_response)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode geoid response"}), 500
    
    if "data" not in geoid_data or not geoid_data["data"]:
        return jsonify({"error": "Invalid location or geoid not found"}), 404
    
    geoid = geoid_data["data"][0]["geoId"]
    
    hotel_response = make_api_request(
        "/api/v1/hotels/searchHotels",
        f"geoId={geoid}&checkIn={checkin}&checkOut={checkout}&pageNumber={page_number}&sort={sort}&guests={guests}"
    )
    try:
        hotel_data = json.loads(hotel_response)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode hotel search response"}), 500
    
    return jsonify(hotel_data)

# Yatra Sahayak AI Chatbot

template = """
You are a travel assistant chatbot named Yatra Sahayak. Help users with:
- Flight, hotel, and rental car bookings
- Destination details, travel tips, weather updates
- Local attractions and customer service inquiries

Chat history:
{chat_history}

User question:
{user_question}
"""

prompt = ChatPromptTemplate.from_template(template)

def get_response(user_query, chat_history, language):
    llm = HuggingFaceEndpoint(
        huggingfacehub_api_token=api_token,
        repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
        task="text-generation"
    )

    chain = prompt | llm | StrOutputParser()

    response = chain.invoke({
        "chat_history": chat_history,
        "user_question": user_query,
    })

    if language != 'en':
        response = translate_to_language(response, language)
    
    return filter_labels(response.strip())

def translate_to_language(text, language):
    translator = Translator()
    translated = translator.translate(text, dest=language)
    return translated.text

def filter_labels(response):
    labels_to_remove = ["AI response:", "Yatra Sahayak Response:", "AI Assistance:", "Response rating:"]
    for label in labels_to_remove:
        if response.startswith(label):
            response = response[len(label):].strip()
    return response

chat_history = [AIMessage(content="Hello, I am Yatra Sahayak. How can I help you?")]

@app.route('/ask', methods=['POST'])
def ask():
    global chat_history
    data = request.json
    user_query = data['user_query']
    language = data.get('language', 'en')
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
