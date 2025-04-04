import os
import json
import random
from typing import Dict, Any, List, Optional

# Placeholder for OpenAI integration
# from openai import OpenAI
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Mock data and functionality for development
MOCK_STRENGTHS = [
    "Clear and concise communication",
    "Strong problem-solving approach",
    "Excellent technical knowledge",
    "Good understanding of system design",
    "Proactive attitude toward challenges",
    "Strong teamwork orientation",
    "Analytical thinking",
    "Attention to detail",
    "Creative solution finding",
    "Strong experience with relevant technologies"
]

MOCK_WEAKNESSES = [
    "Could provide more specific examples",
    "Response lacks depth in some areas",
    "Limited explanation of thought process",
    "Some technical inaccuracies",
    "Incomplete understanding of the question",
    "Could improve problem breakdown approach",
    "Lack of focus on scalability considerations",
    "Limited discussion of alternative approaches",
    "Missing consideration of edge cases",
    "Timeline estimates seem unrealistic"
]

MOCK_KEYWORDS = [
    "algorithm", "efficiency", "optimization", "collaboration", "leadership",
    "architecture", "design patterns", "testing", "agile", "communication",
    "problem-solving", "innovation", "experience", "implementation", "scalability"
]

MOCK_RECOMMENDATIONS = [
    "Candidate shows strong potential and would be a good fit for the role",
    "Candidate demonstrates technical skills but may need mentoring",
    "Highly recommend advancing this candidate to the next interview stage",
    "Candidate has potential but needs additional technical screening",
    "Consider placement in a more junior role than initially targeted",
    "Strong technical skills but might face challenges in team settings",
    "Excellent fit for the position - recommend immediate offer",
    "Recommend additional interview focused on specific technical areas",
    "Good candidate overall but may need coaching on communication skills",
    "Technical skills meet requirements but cultural fit is uncertain"
]

def analyze_response(
    question_type: str,
    question_text: str,
    response_text: Optional[str] = None,
    selected_option: Optional[str] = None,
    options: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Analyze a candidate's response to an interview question.
    This currently uses mock data, but will integrate with OpenAI API in production.
    
    Args:
        question_type: The type of question (text, mcq, video)
        question_text: The text of the question asked
        response_text: The candidate's text response or video transcript
        selected_option: For MCQ questions, the option selected
        options: For MCQ questions, the list of available options
        
    Returns:
        A dictionary containing the analysis results
    """
    # In development mode, return mock data
    if os.getenv("APP_ENV") == "development" or not os.getenv("OPENAI_API_KEY"):
        # Generate a score between 1 and 5, with weights to simulate a normal distribution
        score_weights = [0.05, 0.15, 0.55, 0.20, 0.05]
        score = random.choices([1, 2, 3, 4, 5], weights=score_weights)[0]
        
        # Select between 1-3 random strengths and weaknesses
        num_strengths = random.randint(1, 3)
        num_weaknesses = random.randint(1, 3)
        strengths = random.sample(MOCK_STRENGTHS, num_strengths)
        weaknesses = random.sample(MOCK_WEAKNESSES, num_weaknesses)
        
        # Select 3-5 keywords
        num_keywords = random.randint(3, 5)
        keywords = random.sample(MOCK_KEYWORDS, num_keywords)
        
        # Generate some mock notes
        notes = f"Response scored {score}/5. Demonstrated {', '.join(strengths[:1])}. Could improve on {', '.join(weaknesses[:1])}."
        
        # Generate sentiment
        sentiment = random.choice(["positive", "neutral", "negative"])
        if score >= 4:
            sentiment = "positive"
        elif score <= 2:
            sentiment = "negative"
        
        return {
            "score": score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "notes": notes,
            "keywords": keywords,
            "sentiment": sentiment
        }
    
    # In production, use OpenAI API
    else:
        # TODO: Implement OpenAI API integration
        """
        Example of how this would be implemented:
        
        messages = [
            {"role": "system", "content": "You are an expert interviewer analyzing candidate responses."},
            {"role": "user", "content": f"Question: {question_text}\n\nResponse: {response_text or selected_option}"}
        ]
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            functions=[{
                "name": "analyze_response",
                "description": "Analyze the candidate's response",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "number",
                            "description": "Score from 1-5 where 5 is excellent"
                        },
                        "strengths": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of strengths in the response"
                        },
                        "weaknesses": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of weaknesses or areas for improvement"
                        },
                        "notes": {
                            "type": "string",
                            "description": "General notes about the response"
                        },
                        "keywords": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Key terms or concepts mentioned in response"
                        },
                        "sentiment": {
                            "type": "string",
                            "enum": ["positive", "neutral", "negative"],
                            "description": "Overall sentiment of the response"
                        }
                    },
                    "required": ["score", "strengths", "weaknesses", "notes"]
                }
            }]
        )
        
        return json.loads(response.choices[0].message.function_call.arguments)
        """
        
        # Fallback to mock data for now
        return analyze_response(question_type, question_text, response_text, selected_option, options)


def analyze_full_interview(interview_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze a complete interview with multiple responses.
    This currently uses mock data, but will integrate with OpenAI API in production.
    
    Args:
        interview_data: A dictionary containing interview data including responses
        
    Returns:
        A dictionary containing the overall analysis results
    """
    # In development mode, return mock data
    if os.getenv("APP_ENV") == "development" or not os.getenv("OPENAI_API_KEY"):
        # Calculate average score from individual response scores
        if interview_data.get("responses"):
            scores = [r.get("score", 0) for r in interview_data["responses"]]
            overall_score = sum(scores) / len(scores) if scores else 3.0
        else:
            overall_score = random.uniform(2.5, 4.0)  # Random score between 2.5 and 4.0
        
        # Round to 1 decimal place
        overall_score = round(overall_score, 1)
        
        # Get a random recommendation
        recommendation = random.choice(MOCK_RECOMMENDATIONS)
        
        # Collect all strengths and weaknesses from responses
        all_strengths = []
        all_weaknesses = []
        for response in interview_data.get("responses", []):
            all_strengths.extend(response.get("strengths", []))
            all_weaknesses.extend(response.get("weaknesses", []))
        
        # Count occurrence of each strength and weakness
        strength_counts = {}
        for strength in all_strengths:
            strength_counts[strength] = strength_counts.get(strength, 0) + 1
        
        weakness_counts = {}
        for weakness in all_weaknesses:
            weakness_counts[weakness] = weakness_counts.get(weakness, 0) + 1
        
        # Sort by count and select top strengths and weaknesses
        top_strengths = [s for s, _ in sorted(strength_counts.items(), key=lambda x: x[1], reverse=True)[:3]]
        top_weaknesses = [w for w, _ in sorted(weakness_counts.items(), key=lambda x: x[1], reverse=True)[:3]]
        
        # If we don't have enough from responses, add some random ones
        while len(top_strengths) < 3:
            new_strength = random.choice(MOCK_STRENGTHS)
            if new_strength not in top_strengths:
                top_strengths.append(new_strength)
                
        while len(top_weaknesses) < 3:
            new_weakness = random.choice(MOCK_WEAKNESSES)
            if new_weakness not in top_weaknesses:
                top_weaknesses.append(new_weakness)
        
        return {
            "overall_score": overall_score,
            "recommendation": recommendation,
            "strengths": top_strengths,
            "weaknesses": top_weaknesses
        }
    
    # In production, use OpenAI API
    else:
        # TODO: Implement OpenAI API integration
        """
        Example of how this would be implemented:
        
        # Format the interview data for the API
        response_summaries = []
        for resp in interview_data.get("responses", []):
            summary = {
                "question": resp.get("question_text", ""),
                "response": resp.get("response_text", ""),
                "score": resp.get("score", 0),
                "strengths": resp.get("strengths", []),
                "weaknesses": resp.get("weaknesses", [])
            }
            response_summaries.append(summary)
        
        prompt = {
            "candidate": interview_data.get("candidate_name", "Candidate"),
            "position": interview_data.get("position", "Not specified"),
            "responses": response_summaries
        }
        
        messages = [
            {"role": "system", "content": "You are an expert interviewer analyzing complete candidate interviews."},
            {"role": "user", "content": f"Please analyze this interview: {json.dumps(prompt)}"}
        ]
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            functions=[{
                "name": "analyze_interview",
                "description": "Analyze the complete interview",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "overall_score": {
                            "type": "number",
                            "description": "Overall score from 1-5 where 5 is excellent"
                        },
                        "recommendation": {
                            "type": "string",
                            "description": "Hiring recommendation"
                        },
                        "strengths": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of candidate's key strengths"
                        },
                        "weaknesses": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of candidate's key weaknesses or areas for improvement"
                        }
                    },
                    "required": ["overall_score", "recommendation", "strengths", "weaknesses"]
                }
            }]
        )
        
        return json.loads(response.choices[0].message.function_call.arguments)
        """
        
        # Fallback to mock data for now
        return analyze_full_interview(interview_data) 