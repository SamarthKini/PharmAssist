import os
import json
import requests
from dotenv import load_dotenv
from sqlmodel import select
from app.database import get_session
from app.models import Medicine
from contextlib import contextmanager

load_dotenv()

class Chatbot:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable not set")

        self.site_url = os.getenv("SITE_URL", "http://localhost:8000")
        self.app_name = os.getenv("APP_NAME", "PharmAssist")

        self.model = os.getenv("OPENROUTER_MODEL", "google/gemma-4-31b-it:free")  # or "meta-llama/llama-3-70b-instruct"
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"

        self.get_db_session = contextmanager(get_session)

    def generate_response(self, query, prescription_drugs):
        medicine_details = self.get_medicine_details(prescription_drugs)

        system_prompt = f"""
You are a medical assistant specialized in pharmaceutical information.
Your role is to answer questions ONLY about the medicines in the user's current prescription, common over-the-counter (OTC) drugs, and medical remedies.

Current Prescription:
{medicine_details if medicine_details else "No medicines in prescription."}

Rules:
1. For non-medical questions, respond: "I specialize in medication information only."
2. Provide accurate, concise information based on the medicine details above.
3. Mention side effects and interactions when relevant to the question.
4. Common OTC drugs include: pain relievers (like acetaminophen, ibuprofen), antacids, cough and cold medicines, allergy medicines, etc.
"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": self.site_url,  
            "X-Title": self.app_name,       
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.1,
            "max_tokens": 1024,
        }

        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=100)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except requests.exceptions.RequestException as e:
            print(f"OpenRouter API error: {e}")
            if response:
                print(f"Response: {response.text}")
            return "I encountered an error processing your request. Please try again later."

    def get_medicine_details(self, medicine_names):
        if not medicine_names:
            return ""

        details = []
        with self.get_db_session() as session:
            for name in medicine_names:
                medicine = session.exec(
                    select(Medicine).where(Medicine.name == name)
                    .where(Medicine.status == 1)
                    # change here
                ).first()
                if medicine:
                    interactions = "None"
                    if medicine.interaction:
                        try:
                            interactions_list = json.loads(medicine.interaction)
                            interactions = ", ".join(interactions_list)
                        except json.JSONDecodeError:
                            interactions = medicine.interaction

                    details.append(
                        f"Medicine: {medicine.name}\n"
                        f"Salt Composition: {medicine.salt or 'N/A'}\n"
                        f"Description: {medicine.description or 'N/A'}\n"
                        f"Side Effects: {medicine.side_effects or 'N/A'}\n"
                        f"Interactions: {interactions}\n"
                    )
        return "\n\n".join(details) if details else ""